"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionStore = exports.inside = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const dashboard_1 = require("./dashboard");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const node_child_process_1 = require("node:child_process");
const node_sqlite_1 = require("node:sqlite");
const native_1 = require("./native");
const text_diff_1 = require("./text-diff");
const file_controls_1 = require("./file-controls");
const record_deletion_1 = require("./record-deletion");
const record_background_1 = require("./record-background");
const identity = (s) => `${s.dev}:${s.ino}:${s.birthtimeNs}`;
const signature = (s) => `${identity(s)}:${s.size}:${s.mtimeNs}:${s.ctimeNs}`;
const MAX = 100 * 1024 * 1024;
const OMIT = new Set(['.git', 'node_modules', '.windowsill-recovered', '.DS_Store']);
const inside = (root, file) => { const rel = node_path_1.default.relative(root, file); return !rel || (!rel.startsWith('..' + node_path_1.default.sep) && rel !== '..' && !node_path_1.default.isAbsolute(rel)); };
exports.inside = inside;
async function digest(file) { const hash = (0, node_crypto_1.createHash)('sha256'); for await (const b of node_fs_1.default.createReadStream(file))
    hash.update(b); return hash.digest('hex'); }
function message(e) { return e instanceof native_1.AppError ? e.message : e instanceof Error ? e.message.slice(0, 240) : '파일 상태를 확인하지 못했어요.'; }
const pause = (ms) => new Promise(r => setTimeout(r, ms));
/** App-private Git storage. Every ref update is serialized with the SQLite outbox. */
class VersionStore {
    dataDir;
    onDiagnostic = () => { };
    db;
    repo;
    git;
    ready = false;
    error = '';
    onChange = () => { };
    onRecordsDeleted = (_target) => { };
    deleting = false;
    recordJob = null;
    get recordRecoveryRequired() { return !!this.db.prepare('SELECT id FROM record_deletion').get(); }
    backgroundCoreDir = '';
    beforeRecordDeletion = async () => { };
    onBackgroundRecordsDeleted = () => { };
    recordWork;
    recordDeletion;
    transferActive = () => false;
    afterCommit; // crash injection, never set by production IPC
    chain = Promise.resolve();
    scanning = false;
    scanningRoot = null;
    foreground = [];
    urgent(fn) {
        if (!this.scanning)
            return this.serial(fn);
        return new Promise((resolve, reject) => this.foreground.push(async () => { try {
            resolve(await fn());
        }
        catch (e) {
            reject(e);
        } }));
    }
    async serveForeground() { let served = false; while (this.foreground.length) {
        served = true;
        await this.foreground.shift()();
    } return served; }
    async scanTurn(id, full) {
        this.scanning = true;
        this.scanningRoot = id;
        try {
            return await this.scanInternal(id, full);
        }
        finally {
            await this.serveForeground();
            this.scanning = false;
            this.scanningRoot = null;
        }
    }
    watchers = new Map();
    timers = new Map();
    interval;
    stopping = false;
    scanQueued = new Map();
    dirty = new Set();
    lastFull = new Map();
    started = Date.now();
    settle;
    constructor(dataDir, options = {}) {
        this.dataDir = dataDir;
        node_fs_1.default.mkdirSync(dataDir, { recursive: true });
        node_fs_1.default.mkdirSync(node_path_1.default.join(dataDir, 'pending'), { recursive: true });
        this.repo = node_path_1.default.join(dataDir, 'history.git');
        this.git = options.git || process.env.WINDOWSILL_GIT || 'git';
        this.settle = options.settle ?? 350;
        this.db = new node_sqlite_1.DatabaseSync(node_path_1.default.join(dataDir, 'versions.sqlite'));
        this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS roots (id TEXT PRIMARY KEY, plant INTEGER UNIQUE, path TEXT, identity TEXT, active INTEGER, status TEXT, error TEXT DEFAULT '', scanned INTEGER DEFAULT 0, total INTEGER DEFAULT 0, excluded INTEGER DEFAULT 0);
      CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, root TEXT, path TEXT, identity TEXT, hash TEXT DEFAULT '', status TEXT, error TEXT DEFAULT '', observed INTEGER, signature TEXT DEFAULT '');
      CREATE INDEX IF NOT EXISTS file_path ON files(root,path);
      CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, file TEXT, kind TEXT, path TEXT, old_path TEXT DEFAULT '', hash TEXT DEFAULT '', snapshot TEXT DEFAULT '', blob TEXT DEFAULT '', status TEXT, commit_id TEXT DEFAULT '', created INTEGER, metadata TEXT);
      CREATE TABLE IF NOT EXISTS versions (id TEXT PRIMARY KEY, file TEXT, seq INTEGER, hash TEXT, blob TEXT, commit_id TEXT, created INTEGER, kind TEXT, UNIQUE(file,seq));
      CREATE TABLE IF NOT EXISTS gaps (id TEXT PRIMARY KEY, root TEXT, start INTEGER, end INTEGER, reason TEXT);
      CREATE TABLE IF NOT EXISTS preferences (root TEXT, pattern TEXT, folder TEXT, count REAL, updated INTEGER, PRIMARY KEY(root,pattern,folder));
      CREATE TABLE IF NOT EXISTS learned_ops (op TEXT PRIMARY KEY, root TEXT, pattern TEXT, folder TEXT, weight REAL, active INTEGER);
      CREATE TABLE IF NOT EXISTS rules (id TEXT PRIMARY KEY, root TEXT, scope TEXT, template TEXT, revision INTEGER, active INTEGER);
      CREATE TABLE IF NOT EXISTS exceptions (file TEXT, rule TEXT, revision INTEGER, PRIMARY KEY(file,rule,revision));
      CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);`);
        const rootColumns = this.db.prepare('PRAGMA table_info(roots)').all();
        (0, file_controls_1.fileControlsSchema)(this.db);
        for (const column of ['processed', 'total_known'])
            if (!rootColumns.some(c => c.name === column))
                this.db.exec(`ALTER TABLE roots ADD COLUMN ${column} INTEGER DEFAULT 0`);
        this.db.exec('CREATE TABLE IF NOT EXISTS root_folders (root TEXT, path TEXT, PRIMARY KEY(root,path))');
        this.db.exec('CREATE TABLE IF NOT EXISTS root_inventory (root TEXT, path TEXT, kind TEXT, reason TEXT, PRIMARY KEY(root,path))');
        this.db.exec('CREATE TABLE IF NOT EXISTS file_sizes (file TEXT PRIMARY KEY, bytes INTEGER NOT NULL, checked INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS file_opens (file TEXT PRIMARY KEY, opened INTEGER NOT NULL)');
        const savedBudget = Number(this.db.prepare("SELECT value FROM meta WHERE key='storage-budget'").get()?.value);
        this.budget = options.budget ?? ([1, 2, 5, 10, 20, 50].map(n => n * 1024 ** 3).includes(savedBudget) ? savedBudget : 5 * 1024 ** 3);
        this.recordDeletion = new record_deletion_1.RecordDeletion(this.db, (args, input) => this.gitRun(args, input), target => {
            this.recordsApplied(target);
            this.onRecordsDeleted(target);
        });
    }
    recordsApplied(target) {
        if (target.kind === 'root') {
            this.watchers.get(target.root)?.close();
            this.watchers.delete(target.root);
            clearTimeout(this.timers.get(target.root));
            this.timers.delete(target.root);
            this.dirty.delete(target.root);
            this.lastFull.delete(target.root);
        }
    }
    async backgroundRecords(kind, id = '') {
        const { result, target } = await (0, record_background_1.recordBackground)(this.dataDir, this.backgroundCoreDir, this.git, kind, id, phase => { this.recordJob = { phase }; this.onChange(); });
        if (target) {
            this.recordsApplied(target);
            this.onBackgroundRecordsDeleted();
        }
        return result;
    }
    async recoverRecords() {
        if (this.backgroundCoreDir)
            await this.backgroundRecords('recover');
        else {
            await this.recordDeletion.recover();
            await this.recordDeletion.compact();
        }
    }
    budget;
    storage = null;
    storageWork = false;
    diskFree() { return promises_1.default.statfs(this.dataDir).then(s => Number(s.bavail) * Number(s.bsize)).catch(() => null); }
    async measureStorage() {
        const used = await this.usage(), repo = await this.usage(this.repo).catch(() => 0), pending = await this.usage(node_path_1.default.join(this.dataDir, 'pending'));
        const disk = await this.diskFree();
        const diskTotal = await promises_1.default.statfs(this.dataDir).then(s => Number(s.blocks) * Number(s.bsize)).catch(() => null);
        return this.storage = { used, repo, pending, other: Math.max(0, used - repo - pending), free: disk, diskTotal, budget: this.budget, remaining: Math.max(0, this.budget - used), versions: Number(this.db.prepare('SELECT COUNT(*) n FROM versions').get().n), checked: Date.now(), working: this.storageWork };
    }
    storageStatus() { return this.deleting ? this.measureStorage() : this.urgent(() => this.measureStorage()); }
    async setStorageBudget(gib) {
        if (typeof gib !== 'number' || ![1, 2, 5, 10, 20, 50].includes(gib))
            throw new native_1.AppError('SPACE', '보관 한도를 다시 선택해 주세요.');
        // A quota preference does not mutate Git or files. Persist it immediately;
        // waiting behind a full scan makes the UI appear locked for thousands of files.
        const budget = gib * 1024 ** 3;
        this.db.prepare("INSERT OR REPLACE INTO meta VALUES ('storage-budget',?)").run(String(budget));
        this.budget = budget;
        const result = this.storage ? this.storage = { ...this.storage, budget, remaining: Math.max(0, budget - this.storage.used), working: this.storageWork } : await this.measureStorage();
        for (const root of this.roots())
            if (root.active)
                this.requestScan(root.id, true);
        this.onChange();
        return result;
    }
    async compactStorage() {
        if (this.storageWork)
            throw new native_1.AppError('BUSY', '보관 공간을 정리하고 있어요.');
        this.storageWork = true;
        this.onChange();
        try {
            return await this.serial(async () => {
                if (!this.ready || this.error)
                    throw new native_1.AppError('GIT', this.error || '저장소를 먼저 확인해 주세요.');
                await this.drain();
                const before = await this.measureStorage();
                if (before.free === null || before.free < before.repo * 2 + 64 * 1024 ** 2)
                    throw new native_1.AppError('SPACE', '압축에 필요한 임시 공간이 부족해요. 디스크 여유 공간을 먼저 확보해 주세요.');
                // Repack keeps all reachable history and unreachable objects. Never expire or prune history.
                await this.gitRun(['repack', '-a', '-d', '--keep-unreachable']);
                await this.gitRun(['prune-packed']);
                const after = await this.measureStorage();
                return { ...after, saved: Math.max(0, before.used - after.used) };
            });
        }
        finally {
            this.storageWork = false;
            if (this.storage)
                this.storage.working = false;
            this.onChange();
        }
    }
    serial(fn) { const p = this.chain.then(fn); this.chain = p.catch(() => { }); return p; }
    gitRun(args, input) {
        return new Promise((resolve, reject) => {
            const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));
            const child = (0, node_child_process_1.spawn)(this.git, ['--git-dir', this.repo, ...args], { windowsHide: true, env: { ...env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null', GIT_TERMINAL_PROMPT: '0', GIT_AUTHOR_NAME: 'Windowsill', GIT_AUTHOR_EMAIL: 'local@windowsill.invalid', GIT_COMMITTER_NAME: 'Windowsill', GIT_COMMITTER_EMAIL: 'local@windowsill.invalid' }, stdio: ['pipe', 'pipe', 'pipe'] });
            const out = [];
            let size = 0, stderr = '';
            let settled = false;
            const fail = (e) => { if (!settled) {
                settled = true;
                reject(e);
            } };
            const timer = setTimeout(() => { child.kill(); fail(new native_1.AppError('GIT', '이력 저장 응답이 늦어요. 상태를 다시 확인해 주세요.')); }, 60_000);
            child.on('error', e => { clearTimeout(timer); fail(new native_1.AppError('GIT', `Git 실행을 준비하지 못했어요. ${e.message}`)); });
            child.stdout.on('data', (b) => { size += b.length; if (size > MAX + 1024 * 1024) {
                child.kill();
                fail(new native_1.AppError('GIT', '이력 데이터 크기 제한을 넘었어요.'));
            }
            else
                out.push(b); });
            child.stderr.on('data', b => { stderr = (stderr + b.toString()).slice(-2000); });
            child.stdin.on('error', () => { });
            child.on('close', code => { clearTimeout(timer); if (settled)
                return; settled = true; code === 0 ? resolve(Buffer.concat(out)) : reject(new native_1.AppError('GIT', `이력 저장을 마치지 못했어요. ${stderr.slice(0, 240)}`)); });
            child.stdin.end(input);
        });
    }
    async init() {
        try {
            await this.gitRun(['init', '--bare', '--quiet', this.repo]);
            await this.gitRun(['config', 'core.autocrlf', 'false']);
            await this.gitRun(['config', 'gc.auto', '0']);
            await this.gitRun(['config', 'core.fsync', 'all']);
            await this.gitRun(['config', 'core.hooksPath', node_path_1.default.join(this.dataDir, 'no-hooks')]);
            this.ready = true;
            this.error = '';
            await this.serial(() => this.recoverRecords());
            this.recordJob = null;
            await this.serial(() => this.drain());
            const last = Number(this.db.prepare("SELECT value FROM meta WHERE key='heartbeat'").get()?.value || 0);
            for (const r of this.roots())
                if (r.active && last)
                    this.db.prepare('INSERT INTO gaps VALUES (?,?,?,?,?)').run((0, node_crypto_1.randomUUID)(), r.id, last, this.started, '앱이 실행되지 않은 구간: 중간 편집 내용은 보관되지 않았을 수 있어요.');
            this.heartbeat();
            this.onChange();
            return true;
        }
        catch (e) {
            this.onDiagnostic(e);
            this.error = message(e);
            this.onChange();
            return false;
        }
    }
    heartbeat() { this.db.prepare("INSERT OR REPLACE INTO meta VALUES ('heartbeat',?)").run(String(Date.now())); }
    roots() { return this.db.prepare('SELECT * FROM roots ORDER BY plant').all(); }
    root(id) { const r = this.db.prepare('SELECT * FROM roots WHERE id=?').get(id); if (!r)
        throw new native_1.AppError('ROOT', '관리할 폴더를 먼저 등록해 주세요.'); return r; }
    rootForPlant(plant) { return this.db.prepare('SELECT * FROM roots WHERE plant=?').get(plant); }
    rootForPath(file) { return this.roots().find(r => r.active && (0, exports.inside)(r.path, file)); }
    validateRoot(folder, plant) {
        if (plant !== null && (!Number.isInteger(plant) || plant < 0 || plant > 2))
            throw new native_1.AppError('PLANT', '화분은 1~3번 중 선택해 주세요.');
        const p = (0, native_1.safeManagedPath)(folder, true);
        const existing = this.roots().find(r => r.path === p);
        if (existing && existing.identity !== identity(node_fs_1.default.statSync(p, { bigint: true })))
            throw new native_1.AppError('ROOT', '등록했던 폴더의 정체가 바뀌었어요. 기존 기록을 확인해 주세요.');
        if ((0, exports.inside)(p, this.dataDir) || (0, exports.inside)(this.dataDir, p))
            throw new native_1.AppError('ROOT', '앱 기록 저장소를 포함하지 않는 폴더를 선택해 주세요.');
        for (const r of this.roots())
            if (r.path !== p && ((0, exports.inside)(r.path, p) || (0, exports.inside)(p, r.path)))
                throw new native_1.AppError('ROOT', '이미 등록된 관리 범위와 겹쳐요. 기존 관리 폴더를 선택해 주세요.');
        return p;
    }
    async preview(folder, plant = null) {
        const p = this.validateRoot(folder, plant);
        const list = await this.inventory(p);
        return { folder: p, identity: identity(await promises_1.default.stat(p, { bigint: true })), count: list.files.length, bytes: list.bytes, excluded: list.excluded, issues: list.issues.slice(0, 15), complete: list.complete, budget: this.budget, gitReady: this.ready && !this.error };
    }
    async register(folder, plant, expectedIdentity, count = 0, totalKnown = false) {
        if (!this.ready || this.error)
            throw new native_1.AppError('GIT', this.error || '버전 저장소를 먼저 준비해 주세요.');
        const p = this.validateRoot(folder, plant);
        const key = identity(await promises_1.default.stat(p, { bigint: true }));
        if (key !== expectedIdentity)
            throw new native_1.AppError('CHANGED', '선택한 폴더가 바뀌었어요. 다시 선택해 주세요.');
        const old = this.roots().find(r => r.path === p);
        const id = old?.id || (0, node_crypto_1.randomUUID)();
        if (old && old.identity !== key)
            throw new native_1.AppError('ROOT', '등록했던 폴더의 정체가 바뀌었어요. 기존 기록을 확인해 주세요.');
        this.db.prepare("INSERT INTO roots(id,plant,path,identity,active,status,total,total_known) VALUES (?,NULL,?,?,1,'initial',?,?) ON CONFLICT(id) DO UPDATE SET active=1,status='initial',total=excluded.total,total_known=excluded.total_known").run(id, p, key, count, totalKnown ? 1 : 0);
        if (plant !== null)
            this.assignShortcut(id, plant);
        this.watch(this.root(id));
        this.requestScan(id, true);
        this.onChange();
        return id;
    }
    assignShortcut(id, plant) {
        const root = this.root(id);
        this.validateRoot(root.path, plant);
        if (identity(node_fs_1.default.statSync(root.path, { bigint: true })) !== root.identity)
            throw new native_1.AppError('ROOT', '관리 폴더가 바뀌었어요. 다시 확인해 주세요.');
        this.db.exec('BEGIN IMMEDIATE');
        try {
            this.db.prepare('UPDATE roots SET plant=NULL WHERE plant=?').run(plant);
            this.db.prepare('UPDATE roots SET plant=? WHERE id=?').run(plant, id);
            this.db.exec('COMMIT');
        }
        catch (e) {
            this.db.exec('ROLLBACK');
            throw e;
        }
    }
    start() {
        if (this.interval || this.stopping)
            return;
        for (const r of this.roots())
            if (r.active) {
                this.watch(r);
                this.requestScan(r.id, true);
            }
        let lastTick = Date.now();
        this.interval = setInterval(() => {
            const now = Date.now();
            const resumed = now - lastTick > 90_000;
            lastTick = now;
            if (this.deleting || this.stopping)
                return;
            this.heartbeat();
            // A timer tick is not evidence of a file change. Let an existing scan
            // finish instead of keeping slow roots permanently queued/scanning.
            for (const r of this.roots())
                if (r.active && !this.scanQueued.has(r.id) && this.scanningRoot !== r.id)
                    this.requestScan(r.id, resumed || now - (this.lastFull.get(r.id) || 0) > 24 * 60 * 60 * 1000);
        }, 60_000);
        this.interval.unref();
    }
    watch(r) {
        if (this.stopping || this.watchers.has(r.id) || !r.active)
            return;
        try {
            const w = node_fs_1.default.watch(r.path, { recursive: true }, () => {
                if (this.stopping)
                    return;
                clearTimeout(this.timers.get(r.id));
                this.timers.set(r.id, setTimeout(() => { this.timers.delete(r.id); this.requestScan(r.id, false); }, 1800));
            });
            w.on('error', () => { w.close(); this.watchers.delete(r.id); if (this.deleting)
                return; this.db.prepare("UPDATE roots SET status='delayed',error=? WHERE id=?").run('변경 감시가 중단됐어요. 정기 재검색으로 확인하고 있어요.', r.id); this.onChange(); });
            this.watchers.set(r.id, w);
        }
        catch (e) {
            this.onDiagnostic(e);
            this.db.prepare("UPDATE roots SET status='delayed',error=? WHERE id=?").run('실시간 감시를 사용할 수 없어 정기 재검색을 사용해요.', r.id);
        }
    }
    requestScan(id, full = true) {
        if (this.deleting || this.recordRecoveryRequired) {
            this.dirty.add(id);
            return;
        }
        if (!this.db.prepare('SELECT id FROM roots WHERE id=?').get(id))
            return;
        if (this.stopping)
            return;
        const queued = this.scanQueued.get(id);
        if (queued) {
            if (queued.running) {
                queued.rerun = true;
                queued.rerunFull ||= full;
            }
            else
                queued.full ||= full;
            return;
        }
        const request = { full, running: false, rerun: false, rerunFull: false };
        this.scanQueued.set(id, request);
        void this.serial(() => { request.running = true; return this.scanTurn(id, request.full); }).catch(e => { this.onDiagnostic(e); this.error = message(e); }).finally(() => {
            this.scanQueued.delete(id);
            this.onChange();
            const deferred = this.dirty.delete(id);
            if ((request.rerun || deferred) && !this.stopping)
                this.requestScan(id, request.rerunFull || deferred);
        });
    }
    scan(id, full = true) { return this.serial(() => this.scanTurn(id, full)); }
    async idle() { await this.chain; }
    async setActive(id, active) {
        return this.serial(async () => {
            const r = this.root(id);
            this.db.prepare('UPDATE roots SET active=?,status=? WHERE id=?').run(active ? 1 : 0, active ? 'initial' : 'paused', id);
            if (!active) {
                this.watchers.get(id)?.close();
                this.watchers.delete(id);
                this.gap(id, '사용자가 관리를 중단한 구간');
            }
            else {
                this.watch(this.root(id));
                this.requestScan(r.id, true);
            }
            this.onChange();
        });
    }
    gap(root, reason) {
        if (!this.db.prepare('SELECT id FROM gaps WHERE root=? AND end=0').get(root))
            this.db.prepare('INSERT INTO gaps VALUES (?,?,?,?,?)').run((0, node_crypto_1.randomUUID)(), root, Date.now(), 0, reason);
    }
    async inventory(root, interactiveYield = false) {
        const files = [], folders = [root], issues = [];
        let excluded = 0, bytes = 0, complete = true;
        const skipped = [];
        const note = (p, kind, reason) => { if (skipped.length < 10000)
            skipped.push({ path: p, kind, reason }); };
        const dev = (await promises_1.default.stat(root, { bigint: true })).dev;
        const walk = async (dir, depth) => {
            if (depth > 32 || files.length >= 10000 || folders.length >= 10000) {
                complete = false;
                issues.push(`${dir}: 목록 한도 (깊이 32, 파일/폴더 10,000개)`);
                note(dir, 'directory', '목록 한도에 도달해 이 폴더의 나머지 항목은 확인하지 못했어요.');
                return;
            }
            let entries;
            try {
                (0, native_1.safeManagedPath)(dir, true);
                entries = await promises_1.default.readdir(dir, { withFileTypes: true });
            }
            catch {
                complete = false;
                issues.push(`${dir}: 읽기 권한 또는 경로 확인 필요`);
                note(dir, 'directory', '읽기 권한 또는 경로를 확인해 주세요.');
                return;
            }
            for (const e of entries) {
                if (interactiveYield)
                    await this.serveForeground();
                if (this.stopping) {
                    complete = false;
                    return;
                }
                const file = node_path_1.default.join(dir, e.name);
                if (OMIT.has(e.name) || e.name.startsWith('~$') || /\.(tmp|swp|lock)$/i.test(e.name)) {
                    excluded++;
                    note(file, e.isDirectory() ? 'directory' : 'file', '자동 보관 제외 규칙에 해당해요.');
                    continue;
                }
                try {
                    if (e.isSymbolicLink())
                        throw new Error('link');
                    const s = await promises_1.default.lstat(file, { bigint: true });
                    if (s.dev !== dev || s.isSymbolicLink() || (!s.isDirectory() && (!s.isFile() || s.nlink > 1n)))
                        throw new Error('unsupported');
                    (0, native_1.safeManagedPath)(file, s.isDirectory());
                    if (s.isDirectory()) {
                        folders.push(file);
                        await walk(file, depth + 1);
                    }
                    else {
                        if (files.length >= 10000) {
                            complete = false;
                            issues.push('파일 10,000개 한도');
                            note(dir, 'directory', '파일 10,000개 한도로 나머지 항목은 확인하지 못했어요.');
                            break;
                        }
                        files.push(file);
                        bytes += Number(s.size);
                    }
                }
                catch {
                    excluded++;
                    issues.push(`${file}: 연결·권한·미지원 파일`);
                    note(file, e.isDirectory() ? 'directory' : 'file', '연결·권한 또는 지원하지 않는 파일 형식을 확인해 주세요.');
                    complete = false;
                }
            }
        };
        await walk(root, 0);
        return { files, folders, excluded, bytes, issues, complete, skipped };
    }
    async stable(file) {
        (0, native_1.safeManagedPath)(file);
        const before = await promises_1.default.stat(file, { bigint: true });
        const free = await this.diskFree();
        if (free !== null && free < Number(before.size) * 3 + 32 * 1024 ** 2)
            throw new native_1.AppError('SPACE', '디스크 여유 공간이 부족해요. 기존 버전을 유지하고 새 보관은 기다려요.');
        if (before.nlink > 1n)
            throw new native_1.AppError('LINK', '하드 링크 파일은 보관할 수 없어요.');
        if (before.size > BigInt(MAX))
            throw new native_1.AppError('SIZE', '100MiB를 넘는 파일은 현재 보관할 수 없어요.');
        if (/\.(sqlite(?:3)?|db|vhdx?|vmdk)$/i.test(file))
            throw new native_1.AppError('LIVE', '실행 중 데이터베이스·가상 디스크는 이 버전에서 보관하지 않아요.');
        await pause(this.settle);
        if (signature(before) !== signature(await promises_1.default.stat(file, { bigint: true })))
            throw new native_1.AppError('CHANGED', '파일을 저장 중이에요. 다음 검사에서 다시 보관해요.');
        const temp = node_path_1.default.join(this.dataDir, 'pending', (0, node_crypto_1.randomUUID)());
        try {
            await promises_1.default.copyFile(file, temp, node_fs_1.default.constants.COPYFILE_EXCL);
            const handle = await promises_1.default.open(temp, 'r+');
            try {
                await handle.sync();
            }
            finally {
                await handle.close();
            }
            const hash = await digest(temp), current = await digest((0, native_1.safeManagedPath)(file));
            const after = await promises_1.default.stat(file, { bigint: true });
            if (signature(before) !== signature(after) || hash !== current)
                throw new native_1.AppError('CHANGED', '저장 중 내용이 바뀌었어요. 다음 검사에서 다시 확인해요.');
            return { temp, hash, identity: identity(after), signature: signature(after), size: Number(after.size) };
        }
        catch (e) {
            await promises_1.default.unlink(temp).catch(() => { });
            throw e;
        }
    }
    async usage(dir = this.dataDir) {
        let sum = 0;
        for (const e of await promises_1.default.readdir(dir, { withFileTypes: true })) {
            const p = node_path_1.default.join(dir, e.name);
            if (e.isDirectory())
                sum += await this.usage(p);
            else if (e.isFile())
                sum += (await promises_1.default.stat(p)).size;
        }
        return sum;
    }
    async scanInternal(id, full) {
        if (this.deleting || this.recordRecoveryRequired) {
            this.dirty.add(id);
            return;
        }
        if (!this.db.prepare('SELECT id FROM roots WHERE id=?').get(id))
            return;
        const root = this.root(id);
        if (!root.active || this.stopping)
            return;
        this.db.prepare("UPDATE roots SET status='scanning',error='' WHERE id=?").run(id);
        this.onChange();
        try {
            if (identity(await promises_1.default.stat((0, native_1.safeManagedPath)(root.path, true), { bigint: true })) !== root.identity)
                throw new native_1.AppError('ROOT', '관리 폴더의 정체가 바뀌었어요. 기존 이력은 보존했어요.');
            await this.drain();
            const listing = await this.inventory(root.path, true), seen = new Set(listing.files);
            this.db.prepare('UPDATE roots SET total=?,excluded=?,processed=0,total_known=? WHERE id=?').run(listing.files.length, listing.excluded, listing.complete ? 1 : 0, id);
            this.db.exec('BEGIN IMMEDIATE');
            try {
                this.db.prepare('DELETE FROM root_folders WHERE root=?').run(id);
                const add = this.db.prepare('INSERT INTO root_folders VALUES (?,?)');
                for (const folder of listing.folders)
                    add.run(id, folder);
                this.db.prepare('DELETE FROM root_inventory WHERE root=?').run(id);
                const remember = this.db.prepare('INSERT OR REPLACE INTO root_inventory VALUES (?,?,?,?)');
                for (const file of listing.files)
                    remember.run(id, file, 'file', '');
                for (const item of listing.skipped)
                    remember.run(id, item.path, item.kind, item.reason);
                this.db.exec('COMMIT');
            }
            catch (e) {
                this.db.exec('ROLLBACK');
                throw e;
            }
            this.onChange();
            let processed = 0, lastProgress = Date.now();
            const old = this.db.prepare('SELECT * FROM files WHERE root=?').all(id);
            const byIdentity = new Map();
            for (const row of old) {
                const group = byIdentity.get(row.identity) || [];
                group.push(row);
                byIdentity.set(row.identity, group);
            }
            const progress = this.db.prepare('UPDATE roots SET processed=? WHERE id=?');
            let failures = 0, error = '';
            let used = await this.usage();
            for (const file of listing.files) {
                while (this.transferActive() && !this.stopping)
                    await pause(50);
                if (await this.serveForeground())
                    used = await this.usage();
                if (this.stopping || this.deleting) {
                    if (this.deleting)
                        this.dirty.add(id);
                    return;
                }
                ++processed;
                if (Date.now() - lastProgress >= 200) {
                    lastProgress = Date.now();
                    progress.run(processed, id);
                    this.onChange();
                }
                if (this.isFileExcluded(id, file))
                    continue;
                const stat = await promises_1.default.stat(file, { bigint: true }).catch(() => null);
                if (!stat) {
                    failures++;
                    continue;
                }
                let row = this.db.prepare("SELECT * FROM files WHERE root=? AND path=? AND status NOT IN ('deleted','replaced') ORDER BY observed DESC LIMIT 1").get(id, file);
                if (row && row.identity !== identity(stat)) {
                    await this.event(row.id, 'replacement-observed', file, '', '', '', { root: id, previousIdentity: row.identity, currentIdentity: identity(stat) });
                    this.db.prepare("UPDATE files SET status='replaced',error='같은 경로의 파일이 교체됐어요. 이전 파일의 버전은 별도로 보존했어요.' WHERE id=?").run(row.id);
                    row = undefined;
                }
                const sameObject = !row ? byIdentity.get(identity(stat))?.find(f => f.status !== 'replaced' && (!seen.has(f.path) || f.path === file) && !this.isFileExcluded(id, f.path)) : undefined;
                if (!row && sameObject) {
                    row = sameObject;
                    await this.event(row.id, 'rename', file, row.path, '', '', { root: id, identity: identity(stat) });
                    this.db.prepare('UPDATE files SET path=?,observed=? WHERE id=?').run(file, Date.now(), row.id);
                    row.path = file;
                }
                if (!row) {
                    row = { id: (0, node_crypto_1.randomUUID)(), root: id, path: file, identity: identity(stat), hash: '', status: 'pending', error: '', observed: Date.now(), signature: '' };
                    this.db.prepare('INSERT INTO files VALUES (?,?,?,?,?,?,?,?,?)').run(row.id, id, file, row.identity, '', 'pending', '', row.observed, '');
                }
                try {
                    this.db.prepare('INSERT INTO file_sizes VALUES (?,?,?) ON CONFLICT(file) DO UPDATE SET bytes=excluded.bytes,checked=excluded.checked WHERE file_sizes.bytes!=excluded.bytes').run(row.id, Number(stat.size), Date.now());
                    if (!full && row.signature === signature(stat) && row.status === 'stored' && !(0, native_1.needsContentVerification)(file))
                        continue;
                    // Full/exFAT verification still reads content. An unchanged digest needs
                    // neither a temporary snapshot nor per-file settle/fsync. Any change
                    // falls back to the existing stable capture and durable Git outbox.
                    if (row.status === 'stored' && row.hash && row.signature === signature(stat) && stat.size <= BigInt(MAX)) {
                        const hash = await digest((0, native_1.safeManagedPath)(file));
                        const after = await promises_1.default.stat(file, { bigint: true });
                        if (hash === row.hash && signature(after) === signature(stat))
                            continue;
                    }
                    if (used + Number(stat.size) * 3 > this.budget)
                        throw new native_1.AppError('SPACE', '버전 저장 예산이 부족해요. 새 버전 보관이 중단됐어요.');
                    const capture = await this.stable(file);
                    if (capture.hash === row.hash)
                        await promises_1.default.unlink(capture.temp);
                    else {
                        await this.event(row.id, row.hash ? 'content' : 'initial', file, '', capture.hash, capture.temp, { root: id, identity: capture.identity, size: capture.size, replacement: row.identity !== capture.identity, previousHash: row.hash });
                        used += capture.size * 2;
                    }
                    this.db.prepare("UPDATE files SET identity=?,hash=?,signature=?,status='stored',error=?,observed=? WHERE id=?").run(capture.identity, capture.hash, capture.signature, row.identity !== capture.identity ? '같은 경로의 파일이 교체됐어요. 경로 기준으로 이어진 이력을 확인해 주세요.' : '', Date.now(), row.id);
                }
                catch (e) {
                    this.onDiagnostic(e);
                    failures++;
                    error = message(e);
                    this.db.prepare("UPDATE files SET status='pending',error=?,observed=? WHERE id=?").run(error, Date.now(), row.id);
                    if (e instanceof native_1.AppError && ['SPACE', 'GIT'].includes(e.code)) {
                        this.gap(id, error);
                        break;
                    }
                }
            }
            progress.run(processed, id);
            const rootStillValid = await promises_1.default.stat(root.path, { bigint: true }).then(s => identity(s) === root.identity).catch(() => false);
            if (listing.complete && rootStillValid)
                for (const row of old) {
                    if (this.isFileExcluded(id, row.path))
                        continue;
                    const current = this.db.prepare('SELECT * FROM files WHERE id=?').get(row.id);
                    if (!['deleted', 'replaced'].includes(current.status) && !seen.has(current.path)) {
                        // A complete accessible parent check is required, not only a watcher rename hint.
                        try {
                            (0, native_1.safeManagedPath)(node_path_1.default.dirname(current.path), true);
                            await promises_1.default.access(current.path);
                        }
                        catch (e) {
                            if (e.code !== 'ENOENT')
                                continue;
                            // A missing ancestor is validated through the successfully scanned root.
                            await this.event(current.id, 'missing', current.path, '', '', '', { root: id });
                            this.db.prepare("UPDATE files SET status='deleted',error='마지막 보관 버전은 남아 있어요.' WHERE id=?").run(current.id);
                        }
                    }
                }
            const pending = Number(this.db.prepare("SELECT COUNT(*) n FROM events WHERE status='pending'").get().n);
            const status = failures || !listing.complete || pending ? 'partial' : this.watchers.has(id) ? 'active' : 'polling';
            this.db.prepare('UPDATE roots SET status=?,error=?,scanned=?,total=?,excluded=? WHERE id=?').run(status, error || listing.issues.slice(0, 3).join('\n'), Date.now(), listing.files.length, listing.excluded, id);
            if (full)
                this.lastFull.set(id, Date.now());
            if (!failures && !pending && listing.complete)
                this.db.prepare('UPDATE gaps SET end=? WHERE root=? AND end=0').run(Date.now(), id);
            this.watch(this.root(id));
            this.heartbeat();
        }
        catch (e) {
            this.onDiagnostic(e);
            const error = message(e);
            this.db.prepare("UPDATE roots SET status='unavailable',error=? WHERE id=?").run(error, id);
            this.gap(id, error);
        }
        this.onChange();
    }
    async event(file, kind, location, old, hash, snapshot, metadata, eventId = (0, node_crypto_1.randomUUID)()) {
        this.db.prepare("INSERT OR IGNORE INTO events(id,file,kind,path,old_path,hash,snapshot,status,created,metadata) VALUES (?,?,?,?,?,?,?,'pending',?,?)").run(eventId, file, kind, location, old, hash, snapshot, Date.now(), JSON.stringify(metadata));
        await this.drain();
        return eventId;
    }
    async drain() {
        if (this.db.prepare('SELECT id FROM record_deletion').get())
            throw new native_1.AppError('DELETE', '이전 기록 삭제를 먼저 완료해 주세요.');
        if (!this.ready)
            throw new native_1.AppError('GIT', this.error || 'Git 저장소를 준비하지 못했어요.');
        for (const event of this.db.prepare("SELECT * FROM events WHERE status='pending' ORDER BY created,rowid").all()) {
            try {
                let head = '';
                try {
                    head = (await this.gitRun(['rev-parse', '--verify', 'refs/heads/history'])).toString().trim();
                }
                catch { /* first commit */ }
                let commit = '';
                if (head) {
                    const text = (await this.gitRun(['log', '-1', '--format=%s', head])).toString().trim();
                    if (text === `event:${event.id}`)
                        commit = head;
                }
                let blob = event.blob;
                if (!commit) {
                    if (event.snapshot) {
                        if (await digest(event.snapshot) !== event.hash)
                            throw new native_1.AppError('INTEGRITY', '보관 대기 파일의 내용이 달라 이력 저장을 멈췄어요.');
                        blob = (await this.gitRun(['hash-object', '-w', '--stdin', '--no-filters'], await promises_1.default.readFile(event.snapshot))).toString().trim();
                    }
                    const record = Buffer.from(JSON.stringify({ ...event, snapshot: undefined, metadata: JSON.parse(event.metadata), blob, schema: 1 }));
                    const meta = (await this.gitRun(['hash-object', '-w', '--stdin', '--no-filters'], record)).toString().trim();
                    const tree = (await this.gitRun(['mktree'], Buffer.from(`${blob ? `100644 blob ${blob}\tcontent\n` : ''}100644 blob ${meta}\tevent.json\n`))).toString().trim();
                    commit = (await this.gitRun(['commit-tree', tree, ...(head ? ['-p', head] : []), '-m', `event:${event.id}`])).toString().trim();
                    await this.gitRun(['update-ref', 'refs/heads/history', commit, head || '0'.repeat(commit.length)]);
                    if (this.afterCommit)
                        this.afterCommit();
                }
                else {
                    const stored = JSON.parse((await this.gitRun(['show', `${commit}:event.json`])).toString());
                    blob = stored.blob;
                }
                if (blob && (0, node_crypto_1.createHash)('sha256').update(await this.gitRun(['cat-file', 'blob', blob])).digest('hex') !== event.hash)
                    throw new native_1.AppError('INTEGRITY', 'Git 내용 검증에 실패했어요.');
                this.db.exec('BEGIN IMMEDIATE');
                try {
                    if (event.hash && ['initial', 'content', 'restore'].includes(event.kind)) {
                        const seq = Number(this.db.prepare('SELECT COALESCE(MAX(seq),0)+1 n FROM versions WHERE file=?').get(event.file).n);
                        this.db.prepare('INSERT OR IGNORE INTO versions VALUES (?,?,?,?,?,?,?,?)').run(event.id, event.file, seq, event.hash, blob, commit, event.created, event.kind);
                        this.db.prepare('UPDATE files SET hash=? WHERE id=?').run(event.hash, event.file);
                    }
                    this.db.prepare("UPDATE events SET status='committed',blob=?,commit_id=?,snapshot='' WHERE id=?").run(blob, commit, event.id);
                    this.db.exec('COMMIT');
                }
                catch (e) {
                    this.db.exec('ROLLBACK');
                    throw e;
                }
                if (event.snapshot)
                    await promises_1.default.unlink(event.snapshot).catch(() => { });
            }
            catch (e) {
                this.onDiagnostic(e);
                this.error = message(e);
                throw e;
            }
        }
        this.error = '';
    }
    async retry() {
        if (this.deleting)
            throw new native_1.AppError('BUSY', '관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.');
        this.deleting = true;
        this.onChange();
        try {
            await this.beforeRecordDeletion();
            if (!this.ready)
                await this.init();
            else
                await this.serial(async () => { await this.recoverRecords(); await this.drain(); });
            this.recordJob = null;
        }
        finally {
            this.deleting = false;
            for (const r of this.roots())
                if (r.active)
                    this.requestScan(r.id, true);
            this.onChange();
        }
    }
    dashboardMeasuredAt = 0;
    dashboard() {
        if (!this.stopping && Date.now() - this.dashboardMeasuredAt > 60000) {
            this.dashboardMeasuredAt = Date.now();
            void this.storageStatus().then(() => { if (!this.stopping)
                this.onChange(); }).catch(() => { });
        }
        return (0, dashboard_1.dashboardSnapshot)(this.db);
    }
    recordOpen(id) { (0, dashboard_1.recordFileOpen)(this.db, id); this.onChange(); }
    summary() {
        return { deleting: this.deleting, recordJob: this.recordJob, ready: this.ready, error: this.error, budget: this.budget, storage: this.storage ? { ...this.storage, working: this.storageWork } : null, storageWorking: this.storageWork, roots: this.roots().map(r => ({ ...r, stored: Number(this.db.prepare("SELECT COUNT(*) n FROM files f WHERE root=? AND status='stored' AND NOT EXISTS (SELECT 1 FROM file_controls fc WHERE fc.file=f.id AND fc.state='off')").get(r.id).n), pending: Number(this.db.prepare("SELECT COUNT(*) n FROM files f WHERE root=? AND status='pending' AND NOT EXISTS (SELECT 1 FROM file_controls fc WHERE fc.file=f.id AND fc.state='off')").get(r.id).n), versions: Number(this.db.prepare('SELECT COUNT(*) n FROM versions v JOIN files f ON f.id=v.file WHERE f.root=?').get(r.id).n) })) };
    }
    isFileExcluded(root, p) { return (0, file_controls_1.fileExcluded)(this.db, root, p); }
    deleteRecords(kind, id) {
        if (this.deleting)
            return Promise.reject(new native_1.AppError('BUSY', '관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.'));
        return this.recordWork = this.deleteRecordsInternal(kind, id);
    }
    async deleteRecordsInternal(kind, id) {
        if (this.deleting || this.transferActive())
            throw new native_1.AppError('BUSY', '진행 중인 작업을 마친 뒤 기록을 삭제해 주세요.');
        if (!this.ready || this.error)
            throw new native_1.AppError('GIT', '저장소를 다시 확인한 뒤 기록을 삭제해 주세요.');
        this.deleting = true;
        this.recordJob = { phase: 'queued' };
        this.onChange();
        try {
            await this.beforeRecordDeletion();
            return await this.serial(async () => {
                if (this.transferActive())
                    throw new native_1.AppError('BUSY', '진행 중인 작업을 마친 뒤 기록을 삭제해 주세요.');
                await this.drain();
                try {
                    const result = await (this.backgroundCoreDir ? this.backgroundRecords(kind, id) : this.recordDeletion.start(kind, id));
                    this.storage = null;
                    this.recordJob = { phase: 'done', cleanupPending: result.cleanupPending };
                    return result;
                }
                catch (e) {
                    if (this.db.prepare('SELECT id FROM record_deletion').get())
                        this.error = message(e);
                    throw e;
                }
            });
        }
        catch (e) {
            this.recordJob = { phase: 'failed', error: message(e) };
            this.onDiagnostic(e);
            throw e;
        }
        finally {
            this.deleting = false;
            const pending = [...this.dirty];
            this.dirty.clear();
            for (const id of pending)
                this.requestScan(id, true);
            this.onChange();
        }
    }
    forgotten(id) {
        const row = this.db.prepare("SELECT * FROM file_controls WHERE file=? AND state='off'").get(id);
        return row ? { id: row.file, root: row.root, path: row.path, identity: '', hash: '', status: 'forgotten', error: '', observed: row.updated, signature: '', management: 'off', version_count: 0 } : undefined;
    }
    attentionFiles(rootId) {
        this.root(rootId);
        return this.db.prepare(`SELECT i.path,i.kind,i.reason,f.id,f.status,f.error,
      COALESCE(fc.state,'') management,
      (SELECT COUNT(*) FROM versions v WHERE v.file=f.id) version_count
      FROM root_inventory i LEFT JOIN files f ON f.id=(
        SELECT x.id FROM files x WHERE x.root=i.root AND x.path=i.path AND x.status NOT IN ('deleted','replaced') ORDER BY x.observed DESC LIMIT 1)
      LEFT JOIN file_controls fc ON fc.file=f.id
      WHERE i.root=? AND (i.reason!='' OR f.id IS NULL OR f.status!='stored' OR fc.state='off')
      ORDER BY i.path`).all(rootId).map((row) => {
            const off = this.isFileExcluded(rootId, row.path);
            return { ...row, management: off ? 'off' : row.management,
                reason: row.reason || (off ? '사용자가 자동 관리를 해제했어요.' : row.error || '아직 확인·보관을 마치지 못했어요.') };
        });
    }
    async fileManagement(id, action) {
        if (!['keep', 'stop', 'resume'].includes(String(action)))
            throw new native_1.AppError('FILE', '관리 선택을 다시 확인해 주세요.');
        if (this.transferActive())
            throw new native_1.AppError('BUSY', '파일 이동이 끝난 뒤 관리 상태를 변경해 주세요.');
        return this.urgent(async () => {
            if (this.transferActive())
                throw new native_1.AppError('BUSY', '파일 이동이 끝난 뒤 관리 상태를 변경해 주세요.');
            const f = (this.db.prepare('SELECT * FROM files WHERE id=?').get(id) || this.forgotten(id));
            if (!f)
                throw new native_1.AppError('FILE', '파일 기록을 찾지 못했어요.');
            if (action === 'keep' && !['deleted', 'replaced'].includes(f.status))
                throw new native_1.AppError('FILE', '파일 상태가 바뀌었어요. 다시 확인해 주세요.');
            const key = (0, file_controls_1.filePathKey)(f.path);
            this.db.exec('BEGIN IMMEDIATE');
            try {
                if (action === 'resume' || action === 'keep')
                    this.db.prepare("DELETE FROM file_controls WHERE root=? AND path_key=? AND state='off'").run(f.root, key);
                const targets = action === 'stop' ? this.db.prepare('SELECT * FROM files WHERE root=?').all(f.root).filter(row => (0, file_controls_1.filePathKey)(row.path) === key) : [f];
                for (const row of targets)
                    if (row.status !== 'forgotten')
                        this.db.prepare('INSERT OR REPLACE INTO file_controls VALUES (?,?,?,?,?,?)').run(row.id, row.root, row.path, key, action === 'stop' ? 'off' : 'keep', Date.now());
                this.db.exec('COMMIT');
            }
            catch (e) {
                this.db.exec('ROLLBACK');
                throw e;
            }
            this.onChange();
            if (action === 'resume' || action === 'keep')
                this.requestScan(f.root, true);
            return true;
        });
    }
    list(rootId, view = 'managed') {
        this.root(rootId);
        const rows = this.db.prepare("SELECT f.*, COALESCE(fc.state,'') management, (SELECT COUNT(*) FROM versions v WHERE v.file=f.id) version_count FROM files f LEFT JOIN file_controls fc ON fc.file=f.id WHERE f.root=? AND CASE WHEN ?='unmanaged' THEN COALESCE(fc.state,'')='off' ELSE COALESCE(fc.state,'')!='off' END ORDER BY f.path,f.observed DESC").all(rootId, view);
        if (view === 'unmanaged')
            for (const c of this.db.prepare("SELECT file FROM file_controls fc WHERE root=? AND state='off' AND NOT EXISTS(SELECT 1 FROM files f WHERE f.id=fc.file)").all(rootId))
                rows.push(this.forgotten(c.file));
        return rows;
    }
    browseFolders(rootId) { const root = this.root(rootId); return [root.path, ...this.db.prepare('SELECT path FROM root_folders WHERE root=? AND path!=? ORDER BY path').all(rootId, root.path).map(x => x.path)]; }
    openablePath(id) {
        const file = this.db.prepare('SELECT * FROM files WHERE id=?').get(id);
        if (!file || ['deleted', 'replaced'].includes(file.status))
            throw new native_1.AppError('FILE', '현재 경로에 없는 파일이에요. 보관된 버전을 다른 이름으로 복원해 주세요.');
        const root = this.root(file.root), target = (0, native_1.safeManagedPath)(file.path);
        if (!(0, exports.inside)(root.path, target) || identity(node_fs_1.default.statSync((0, native_1.safeManagedPath)(root.path, true), { bigint: true })) !== root.identity || identity(node_fs_1.default.statSync(target, { bigint: true })) !== file.identity)
            throw new native_1.AppError('FILE', '파일이 바뀌었어요. 지금 확인을 누른 뒤 다시 열어 주세요.');
        return target;
    }
    containingFolder(id) {
        const file = this.db.prepare('SELECT * FROM files WHERE id=?').get(id);
        if (!file)
            throw new native_1.AppError('FILE', '파일 기록을 찾지 못했어요.');
        const root = this.root(file.root), folder = (0, native_1.safeManagedPath)(node_path_1.default.dirname(file.path), true);
        if (!(0, exports.inside)(root.path, folder) || identity(node_fs_1.default.statSync((0, native_1.safeManagedPath)(root.path, true), { bigint: true })) !== root.identity)
            throw new native_1.AppError('ROOT', '관리 경로가 바뀌었어요. 폴더를 다시 확인해 주세요.');
        return folder;
    }
    timeline(id) {
        const file = this.db.prepare("SELECT f.*,COALESCE(fc.state,'') management FROM files f LEFT JOIN file_controls fc ON fc.file=f.id WHERE f.id=?").get(id) || this.forgotten(id);
        if (!file)
            throw new native_1.AppError('FILE', '파일 기록을 찾지 못했어요.');
        return { file, versions: this.db.prepare('SELECT * FROM versions WHERE file=? ORDER BY seq DESC').all(id), events: this.db.prepare('SELECT id,kind,path,old_path,status,created,metadata FROM events WHERE file=? ORDER BY created DESC').all(id), gaps: this.db.prepare('SELECT * FROM gaps WHERE root=? ORDER BY start DESC LIMIT 30').all(file.root) };
    }
    async restore(versionId, destination) {
        return this.serial(async () => {
            const v = this.db.prepare('SELECT * FROM versions WHERE id=?').get(versionId);
            if (!v)
                throw new native_1.AppError('VERSION', '보관된 버전을 선택해 주세요.');
            const parent = (0, native_1.safeManagedPath)(node_path_1.default.dirname(destination), true);
            if ((0, exports.inside)(this.dataDir, destination) || node_path_1.default.basename(destination).startsWith('.'))
                throw new native_1.AppError('PATH', '일반 파일 이름과 위치를 선택해 주세요.');
            if (node_fs_1.default.existsSync(destination))
                throw new native_1.AppError('CONFLICT', '같은 이름이 있어요. 다른 이름으로 복원해 주세요.');
            const bytes = await this.gitRun(['cat-file', 'blob', v.blob]);
            if ((0, node_crypto_1.createHash)('sha256').update(bytes).digest('hex') !== v.hash)
                throw new native_1.AppError('INTEGRITY', '보관 내용 검증에 실패했어요.');
            const temp = node_path_1.default.join(parent, `.windowsill-${(0, node_crypto_1.randomUUID)()}.tmp`);
            try {
                const handle = await promises_1.default.open(temp, 'wx');
                try {
                    await handle.writeFile(bytes);
                    await handle.sync();
                }
                finally {
                    await handle.close();
                }
                (0, native_1.safeManagedPath)(parent, true);
                (0, native_1.moveNoReplace)(temp, destination);
            }
            finally {
                await promises_1.default.unlink(temp).catch(() => { });
            }
            await this.event(v.file, 'restore-copy', destination, '', '', '', { versionId, hash: v.hash });
            const root = this.rootForPath(destination);
            if (root)
                this.requestScan(root.id, true);
            this.onChange();
            return { destination };
        });
    }
    async compareVersions(fileId, fromId, toId) {
        return this.urgent(async () => {
            const file = this.db.prepare('SELECT * FROM files WHERE id=?').get(fileId);
            const from = this.db.prepare('SELECT * FROM versions WHERE id=? AND file=?').get(fromId, fileId);
            const to = this.db.prepare('SELECT * FROM versions WHERE id=? AND file=?').get(toId, fileId);
            if (!file || !from || !to)
                throw new native_1.AppError('DIFF', '같은 파일에 보관된 버전 두 개를 선택해 주세요.');
            if (!/\.(txt|md|markdown|csv|tsv|json|jsonl|xml|html|htm|css|scss|js|jsx|ts|tsx|py|rs|go|java|c|cpp|h|hpp|sh|ps1|sql|yaml|yml|toml|ini|conf|log|srt)$/i.test(file.path))
                throw new native_1.AppError('DIFF', '이 파일 형식은 내용 비교를 지원하지 않아요. 다른 이름으로 복원해 확인해 주세요.');
            const read = async (v) => {
                if (!/^[a-f0-9]{40,64}$/.test(v.blob))
                    throw new native_1.AppError('INTEGRITY', '보관 내용을 확인하지 못했어요.');
                const bytes = Number((await this.gitRun(['cat-file', '-s', v.blob])).toString().trim());
                if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > text_diff_1.TEXT_LIMIT)
                    throw new native_1.AppError('DIFF', '텍스트 비교는 버전당 256KiB까지 지원해요.');
                const data = await this.gitRun(['cat-file', 'blob', v.blob]);
                if ((0, node_crypto_1.createHash)('sha256').update(data).digest('hex') !== v.hash)
                    throw new native_1.AppError('INTEGRITY', '보관 내용 검증에 실패했어요.');
                return data;
            };
            const left = await read(from), right = await read(to);
            return { file: fileId, from: { id: from.id, seq: from.seq }, to: { id: to.id, seq: to.seq }, ...(0, text_diff_1.compareText)(left, right) };
        });
    }
    /** Save a pre-operation recovery object before the existing move engine mutates a file. */
    async protect(source, operationId, metadata) {
        if (this.deleting)
            throw new native_1.AppError('BUSY', '관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.');
        return this.urgent(async () => {
            await this.drain();
            if ((await this.usage()) + Number((await promises_1.default.stat(source)).size) * 3 > this.budget)
                throw new native_1.AppError('SPACE', '이력 저장 공간이 부족해 파일을 변경하지 않았어요.');
            const c = await this.stable(source);
            await this.event('', 'operation-before', source, '', c.hash, c.temp, metadata, `before-${operationId}`);
        });
    }
    async recordOperationInternal(operationId, source, destination, kind) {
        await this.event('', kind, destination, source, '', '', { operationId }, `${kind}-${operationId}`);
        const root = this.rootForPath(destination);
        if (root && !this.isFileExcluded(root.id, destination) && ['copy', 'move'].includes(kind)) {
            const before = (this.db.prepare('SELECT * FROM events WHERE id=? AND status=?').get(`after-${operationId}`, 'committed') || this.db.prepare('SELECT * FROM events WHERE id=? AND status=?').get(`before-${operationId}`, 'committed'));
            if (before && !this.db.prepare('SELECT id FROM versions WHERE id=?').get(before.id)) {
                const stat = await promises_1.default.stat((0, native_1.safeManagedPath)(destination), { bigint: true });
                if (before.kind === 'operation-after' && JSON.parse(before.metadata).captureIdentity !== identity(stat))
                    throw new native_1.AppError('CHANGED', '보관 중 파일이 교체되었어요. 파일 상태를 확인해 주세요.');
                let file = this.db.prepare("SELECT * FROM files WHERE root=? AND path=? AND status NOT IN ('deleted','replaced')").get(root.id, destination);
                if (!file && kind === 'move')
                    file = this.db.prepare("SELECT * FROM files WHERE identity=? AND status NOT IN ('deleted','replaced')").get(identity(stat));
                const id = file?.id || (0, node_crypto_1.randomUUID)();
                this.db.exec('BEGIN IMMEDIATE');
                try {
                    if (!file)
                        this.db.prepare('INSERT INTO files VALUES (?,?,?,?,?,?,?,?,?)').run(id, root.id, destination, identity(stat), before.hash, 'pending', '', Date.now(), '');
                    else
                        this.db.prepare('UPDATE files SET root=?,path=?,hash=? WHERE id=?').run(root.id, destination, before.hash, id);
                    const previous = this.db.prepare('SELECT * FROM versions WHERE file=? ORDER BY seq DESC LIMIT 1').get(id);
                    if (previous?.hash !== before.hash)
                        this.db.prepare('INSERT INTO versions VALUES (?,?,?,?,?,?,?,?)').run(before.id, id, (previous?.seq || 0) + 1, before.hash, before.blob, before.commit_id, before.created, kind);
                    this.db.exec('COMMIT');
                }
                catch (e) {
                    this.db.exec('ROLLBACK');
                    throw e;
                }
            }
        }
    }
    async recordOperation(operationId, source, destination, kind) {
        if (this.deleting)
            throw new native_1.AppError('BUSY', '관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.');
        await this.urgent(() => this.recordOperationInternal(operationId, source, destination, kind));
        for (const r of this.roots())
            if (r.active && ((0, exports.inside)(r.path, source) || (0, exports.inside)(r.path, destination)))
                this.requestScan(r.id, false);
    }
    /** Capture what exists after delivery; never claim an unobserved intermediate edit was saved. */
    async recordTransferred(op, kind) {
        if (this.deleting)
            throw new native_1.AppError('BUSY', '관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.');
        let note = '';
        if (['copy', 'move'].includes(kind)) {
            await this.urgent(async () => {
                await this.drain();
                const root = this.rootForPath(op.destination);
                if (root && this.isFileExcluded(root.id, op.destination)) {
                    note = '관리 해제한 경로예요. 기존 보관본은 유지해요.';
                    return;
                }
                if (!root?.active)
                    throw new native_1.AppError('ROOT', '관리 폴더가 중단되었어요. 다시 연결한 뒤 보관을 재시도해 주세요.');
                let saved = this.db.prepare('SELECT * FROM events WHERE id=?').get(`after-${op.id}`);
                if (!saved) {
                    if ((await this.usage()) + Number((await promises_1.default.stat((0, native_1.safeManagedPath)(op.destination))).size) * 3 > this.budget)
                        throw new native_1.AppError('SPACE', '파일 전달은 끝났지만 보관 공간이 부족해요. 공간을 확보하고 보관만 다시 시도해 주세요.');
                    const c = await this.stable(op.destination);
                    const expected = JSON.parse(op.identity);
                    if (c.identity !== `${expected.dev}:${expected.ino}:${expected.birth}`) {
                        await promises_1.default.unlink(c.temp);
                        throw new native_1.AppError('CHANGED', '전달한 파일이 다른 파일로 교체되었어요. 기존 파일의 보관을 완료하지 못했어요.');
                    }
                    const changed = c.hash !== expected.hash;
                    await this.event('', 'operation-after', op.destination, op.source, c.hash, c.temp, { operationId: op.id, changedSinceTransfer: changed, expectedHash: expected.hash, captureIdentity: c.identity }, `after-${op.id}`);
                    saved = this.db.prepare('SELECT * FROM events WHERE id=?').get(`after-${op.id}`);
                }
                await this.recordOperationInternal(op.id, op.source, op.destination, kind);
                if (JSON.parse(saved.metadata).changedSinceTransfer)
                    note = '전달 후 변경된 현재 내용을 보관했어요. 보관 전 중간 내용은 남아 있지 않을 수 있어요.';
            });
        }
        else
            await this.recordOperation(op.id, op.source, op.destination, kind);
        for (const r of this.roots())
            if (r.active && ((0, exports.inside)(r.path, op.source) || (0, exports.inside)(r.path, op.destination)))
                this.requestScan(r.id, false);
        return note;
    }
    async folders(rootId) { const root = this.root(rootId); return (await this.inventory(root.path)).folders; }
    async close() {
        this.stopping = true;
        clearInterval(this.interval);
        for (const timer of this.timers.values())
            clearTimeout(timer);
        for (const watcher of this.watchers.values())
            watcher.close();
        this.watchers.clear();
        await this.recordWork?.catch(() => { });
        await this.chain;
        for (const watcher of this.watchers.values())
            watcher.close();
        this.watchers.clear();
        this.heartbeat();
        this.db.close();
    }
}
exports.VersionStore = VersionStore;
