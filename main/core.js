"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardenCore = void 0;
exports.dayKey = dayKey;
exports.friendly = friendly;
const folder_import_1 = require("./folder-import");
const tasks_1 = require("./tasks");
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const node_sqlite_1 = require("node:sqlite");
const native_1 = require("./native");
function dayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function id(stat) { return `${stat.dev}:${stat.ino}:${stat.birthtimeNs}`; }
async function fingerprint(file) {
    const s = await promises_1.default.stat(file, { bigint: true });
    if (s.size > 100n * 1024n * 1024n)
        throw new native_1.AppError('SIZE', '프로토타입에서는 100MB 이하 파일을 정리할 수 있어요.');
    const hash = (0, node_crypto_1.createHash)('sha256');
    for await (const chunk of node_fs_1.default.createReadStream(file))
        hash.update(chunk);
    const after = await promises_1.default.stat(file, { bigint: true });
    if (id(s) !== id(after) || s.size !== after.size || s.mtimeNs !== after.mtimeNs)
        throw new native_1.AppError('CHANGED', '확인 중 파일이 바뀌었어요.');
    return { dev: s.dev.toString(), ino: s.ino.toString(), birth: s.birthtimeNs.toString(), size: s.size.toString(), mtime: s.mtimeNs.toString(), hash: hash.digest('hex') };
}
async function matches(file, expected) {
    try {
        return JSON.stringify(await fingerprint((0, native_1.safePath)(file))) === JSON.stringify(expected);
    }
    catch {
        return false;
    }
}
function friendly(error) { return error instanceof native_1.AppError ? error.message : '파일에 접근하지 못했어요. 위치와 권한을 확인해 주세요.'; }
class GardenCore {
    dataDir;
    db;
    tasks;
    plans = new Map();
    results = new Map();
    busy = false;
    cancel = false;
    progress = null;
    onChange = () => { };
    onDiagnostic = () => { };
    // Used only by tests to simulate an interrupted process after a filesystem change.
    afterMove;
    beforeOperation;
    afterOperation;
    constructor(dataDir) {
        this.dataDir = dataDir;
        node_fs_1.default.mkdirSync(dataDir, { recursive: true });
        const upgrading = node_fs_1.default.existsSync(node_path_1.default.join(dataDir, 'garden.sqlite'));
        this.db = new node_sqlite_1.DatabaseSync(node_path_1.default.join(dataDir, 'garden.sqlite'));
        this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
      CREATE TABLE IF NOT EXISTS plants (id INTEGER PRIMARY KEY, name TEXT NOT NULL, folder TEXT, folder_identity TEXT);
      CREATE TABLE IF NOT EXISTS visits (day TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS ops (id TEXT PRIMARY KEY, batch TEXT, plant INTEGER, source TEXT, destination TEXT, identity TEXT, status TEXT, error TEXT DEFAULT '', reward INTEGER DEFAULT 0, day TEXT, created INTEGER);
      CREATE TABLE IF NOT EXISTS rewarded (identity TEXT PRIMARY KEY);
      CREATE TABLE IF NOT EXISTS credits (day TEXT PRIMARY KEY, count INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
        this.tasks = new tasks_1.TaskStore(this.db);
        ['문서', '사진', '보관'].forEach((name, i) => this.db.prepare('INSERT OR IGNORE INTO plants(id,name) VALUES (?,?)').run(i, name));
        const columns = this.db.prepare('PRAGMA table_info(ops)').all();
        const backup = node_path_1.default.join(dataDir, 'garden-before-v0.2.0.sqlite');
        if (upgrading && !columns.some(c => c.name === 'mode') && !node_fs_1.default.existsSync(backup))
            this.db.prepare('VACUUM INTO ?').run(backup);
        for (const [column, type] of [['mode', "TEXT DEFAULT 'move'"], ['temp_path', "TEXT DEFAULT ''"], ['source_identity', "TEXT DEFAULT ''"], ['recovery_path', "TEXT DEFAULT ''"]])
            if (!columns.some(c => c.name === column))
                this.db.exec(`ALTER TABLE ops ADD COLUMN ${column} ${type}`);
    }
    visit(day = dayKey()) { this.db.prepare('INSERT OR IGNORE INTO visits VALUES (?)').run(day); }
    setting(key, fallback = null) { const row = this.db.prepare('SELECT value FROM settings WHERE key=?').get(key); return row ? JSON.parse(row.value) : fallback; }
    setSetting(key, value) { this.db.prepare('INSERT OR REPLACE INTO settings VALUES (?,?)').run(key, JSON.stringify(value)); }
    plant(index) { if (!Number.isInteger(index) || index < 0 || index > 2)
        throw new native_1.AppError('PLANT', '화분을 선택해 주세요.'); return this.db.prepare('SELECT * FROM plants WHERE id=?').get(index); }
    renamePlant(index, name) {
        this.plant(index);
        if (typeof name !== 'string')
            throw new native_1.AppError('NAME', '화분 이름은 1~12자로 입력해 주세요.');
        const title = name.trim();
        if (!title || Array.from(title).length > 12 || /[\u0000-\u001f\u007f]/.test(title))
            throw new native_1.AppError('NAME', '화분 이름은 1~12자로 입력해 주세요.');
        this.db.prepare('UPDATE plants SET name=? WHERE id=?').run(title, index);
        this.onChange();
        return this.state();
    }
    blocked() { return !!this.db.prepare("SELECT id FROM ops WHERE status IN ('planned','undo_planned','needs_review') LIMIT 1").get(); }
    assertReady() { if (this.busy)
        throw new native_1.AppError('BUSY', '정리가 끝난 뒤 다시 시도해 주세요.'); if (this.blocked())
        throw new native_1.AppError('REVIEW', '이전 작업의 상태 확인이 필요해요. 기록에서 다시 확인해 주세요.'); }
    bind(index, folder, name) {
        this.assertReady();
        this.plant(index);
        const target = (0, native_1.safeManagedPath)(folder, true);
        const key = id(node_fs_1.default.statSync(target, { bigint: true }));
        if (this.db.prepare('SELECT id FROM plants WHERE folder_identity=? AND id!=?').get(key, index))
            throw new native_1.AppError('DUPLICATE', '이미 다른 화분에 연결된 폴더예요.');
        const title = (name || this.plant(index).name).trim();
        if (Array.from(title).length < 1 || Array.from(title).length > 12)
            throw new native_1.AppError('NAME', '화분 이름은 1~12자로 입력해 주세요.');
        this.db.prepare('UPDATE plants SET folder=?,folder_identity=?,name=? WHERE id=?').run(target, key, title, index);
        this.onChange();
        return this.state();
    }
    state() {
        const days = Number(this.db.prepare('SELECT COUNT(*) AS n FROM visits').get().n);
        const plants = this.db.prepare('SELECT * FROM plants ORDER BY id').all().map(p => ({ ...p, xp: days + Number(this.db.prepare("SELECT COALESCE(SUM(reward),0) AS n FROM ops WHERE plant=? AND status='completed'").get(p.id).n) }));
        const ops = this.db.prepare('SELECT * FROM ops ORDER BY created DESC LIMIT 200').all();
        return { plants, days, ops, tasks: this.tasks.snapshot(), total: Number(this.db.prepare("SELECT COUNT(*) AS n FROM ops WHERE status='completed'").get().n), today: Number(this.db.prepare('SELECT count FROM credits WHERE day=?').get(dayKey())?.count || 0), blocked: this.blocked(), busy: this.busy, progress: this.progress, settings: { uiLabels: this.setting('uiLabels', {}), managedRootOrder: this.setting('managedRootOrder', []), language: this.setting('language', 'ko'), searchPageSize: this.setting('searchPageSize', 20), fontChoice: this.setting('fontChoice', this.setting('customFont', null) ? 'custom' : 'theme'), customFont: this.setting('customFont', null), visiblePlants: this.setting('visiblePlants', 3), theme: this.setting('theme', 'sage'), reducedMotion: this.setting('reducedMotion', false), onboarded: this.setting('onboarded', false) } };
    }
    async prepare(files, plant, mode = 'move', destinations = {}, options = {}) {
        this.assertReady();
        if (!Array.isArray(files) || !files.length || files.length > (options.folderImport ? 200 : 20))
            throw new native_1.AppError('COUNT', '한 번에 1~20개의 파일을 선택해 주세요.');
        if (!['copy', 'move'].includes(mode))
            throw new native_1.AppError('MODE', '복사 또는 이동을 선택해 주세요.');
        const p = options.managedRoot ? { folder: options.managedRoot.path, folder_identity: options.managedRoot.identity } : this.plant(plant);
        if (!p.folder)
            throw new native_1.AppError('UNBOUND', '화분에 폴더를 먼저 연결해 주세요.');
        const folder = (0, native_1.safePath)(p.folder, true);
        if (id(node_fs_1.default.statSync(folder, { bigint: true })) !== p.folder_identity)
            throw new native_1.AppError('CHANGED', '연결 폴더가 바뀌었어요. 다시 연결해 주세요.');
        this.busy = true;
        this.onChange();
        try {
            const rows = [];
            const targetNames = new Set();
            const originals = new Set();
            for (const file of files) {
                const row = { source: file, destination: '', destinationFolder: destinations[file] ?? folder, name: typeof file === 'string' ? node_path_1.default.basename(file) : '알 수 없는 파일', status: 'ready', reason: '' };
                try {
                    row.source = (0, native_1.safePath)(file);
                    if (originals.has(row.source))
                        throw new native_1.AppError('DUPLICATE', '이미 선택된 파일이에요.');
                    originals.add(row.source);
                    const target = destinations[row.source] === undefined ? folder : destinations[row.source];
                    if (!target) {
                        row.status = 'choose';
                        row.reason = '목적지 폴더를 선택해 주세요.';
                        rows.push(row);
                        continue;
                    }
                    const inspected = (0, folder_import_1.inspectDestination)(folder, target, !!options.allowMissing), parent = inspected.target, relative = node_path_1.default.relative(folder, parent);
                    row.destinationAnchor = inspected.anchor;
                    row.allowMissing = !!options.allowMissing;
                    if (relative === '..' || relative.startsWith('..' + node_path_1.default.sep) || node_path_1.default.isAbsolute(relative))
                        throw new native_1.AppError('BOUNDARY', '연결된 루트 안에서 폴더를 선택해 주세요.');
                    row.destination = node_path_1.default.join(parent, node_path_1.default.basename(row.source));
                    if (node_path_1.default.dirname(row.source) === parent)
                        throw new native_1.AppError('SAME', '이미 이 폴더에 있어요.');
                    const a = node_fs_1.default.statSync(row.source, { bigint: true }), b = node_fs_1.default.statSync(inspected.anchor, { bigint: true });
                    row.parentIdentity = id(b);
                    if (mode === 'move' && a.dev !== b.dev)
                        throw new native_1.AppError('VOLUME', '다른 드라이브로의 이동은 아직 지원하지 않아요. 복사를 선택해 주세요.');
                    const targetKey = process.platform === 'linux' ? row.destination : row.destination.toLocaleLowerCase();
                    if (node_fs_1.default.existsSync(row.destination) || targetNames.has(targetKey))
                        throw new native_1.AppError('CONFLICT', '같은 이름이 있어 건너뛰어요.');
                    row.identity = await fingerprint(row.source);
                    targetNames.add(targetKey);
                }
                catch (error) {
                    row.status = 'skipped';
                    row.reason = friendly(error);
                }
                rows.push(row);
            }
            const plan = { id: options.planId || (0, node_crypto_1.randomUUID)(), plant, folder, folderIdentity: p.folder_identity, created: Date.now(), rows, mode, folderImport: options.folderImport, rootId: options.managedRoot?.id };
            for (const [key, old] of this.plans)
                if (Date.now() - old.created > (old.folderImport ? 600_000 : 60_000))
                    this.plans.delete(key);
            this.plans.set(plan.id, plan);
            return plan;
        }
        finally {
            this.busy = false;
            this.onChange();
        }
    }
    async retryPlan(taskId) {
        this.assertReady();
        const task = this.tasks.get(taskId);
        if (!tasks_1.retryable.has(task.status))
            throw new native_1.AppError('TASK', '이미 처리했거나 확인이 필요한 작업이에요.');
        const plant = this.plant(task.plant);
        if (plant.folder !== task.folder || plant.folder_identity !== task.folderIdentity)
            throw new native_1.AppError('TASK', '연결 폴더가 바뀌었어요. 파일을 다시 선택해 주세요.');
        if (task.identity && !await matches(task.source, task.identity))
            throw new native_1.AppError('TASK', '원본이 바뀌었어요. 파일을 다시 선택해 주세요.');
        const plan = await this.prepare([task.source], task.plant, task.mode, { [task.source]: task.destinationFolder || node_path_1.default.dirname(task.destination) }, { allowMissing: !!task.allowMissing });
        plan.retryTask = taskId;
        return plan;
    }
    finish(op) {
        this.db.exec('BEGIN IMMEDIATE');
        try {
            const key = JSON.parse(op.identity);
            const original = op.source_identity ? JSON.parse(op.source_identity) : key;
            const identity = `${original.dev}:${original.ino}:${original.birth}`;
            const count = Number(this.db.prepare('SELECT count FROM credits WHERE day=?').get(op.day)?.count || 0);
            const reward = count < 10 && !this.db.prepare('SELECT identity FROM rewarded WHERE identity=?').get(identity) ? 1 : 0;
            if (reward) {
                this.db.prepare('INSERT INTO rewarded VALUES (?)').run(identity);
                this.db.prepare('INSERT INTO credits(day,count) VALUES (?,1) ON CONFLICT(day) DO UPDATE SET count=count+1').run(op.day);
            }
            if (op.mode === 'copy')
                this.db.prepare('INSERT OR IGNORE INTO rewarded VALUES (?)').run(`${key.dev}:${key.ino}:${key.birth}`);
            this.db.prepare("UPDATE ops SET status='completed',reward=?,error='' WHERE id=?").run(reward, op.id);
            this.db.exec('COMMIT');
        }
        catch (error) {
            this.db.exec('ROLLBACK');
            throw error;
        }
    }
    async execute(planId) {
        if (this.results.has(planId))
            return this.results.get(planId);
        this.assertReady();
        const plan = this.plans.get(planId);
        if (!plan || Date.now() - plan.created > (plan.folderImport ? 600_000 : 60_000))
            throw new native_1.AppError('EXPIRED', '확인 시간이 지났어요. 파일을 다시 선택해 주세요.');
        const taskIds = this.tasks.start(plan);
        this.plans.delete(planId);
        this.busy = true;
        this.cancel = false;
        const result = [];
        const startedAt = Date.now();
        try {
            for (const [index, row] of plan.rows.entries()) {
                this.progress = { current: index, total: plan.rows.length, name: row.name, startedAt, phaseAt: Date.now(), cancelRequested: this.cancel };
                this.onChange();
                if (row.status !== 'ready' || this.cancel) {
                    const status = this.cancel ? 'canceled' : 'skipped';
                    this.tasks.update(taskIds[index], status, row.reason);
                    result.push({ ...row, status, taskId: taskIds[index] });
                    continue;
                }
                this.tasks.update(taskIds[index], 'running');
                let op;
                let moved = false;
                try {
                    const plant = plan.rootId ? { folder: plan.folder } : this.plant(plan.plant);
                    if (plant.folder !== plan.folder || id(node_fs_1.default.statSync((0, native_1.safePath)(plan.folder, true), { bigint: true })) !== plan.folderIdentity)
                        throw new native_1.AppError('CHANGED', '연결 폴더가 바뀌었어요.');
                    if (!await matches(row.source, row.identity))
                        throw new native_1.AppError('CHANGED', '원본 파일이 바뀌었어요. 다시 확인해 주세요.');
                    if (id(node_fs_1.default.statSync((0, native_1.safePath)(row.destinationAnchor || node_path_1.default.dirname(row.destination), true), { bigint: true })) !== row.parentIdentity)
                        throw new native_1.AppError('CHANGED', '목적지 폴더가 바뀌었어요.');
                    op = { id: (0, node_crypto_1.randomUUID)(), batch: planId, plant: plan.plant, source: row.source, destination: row.destination, identity: JSON.stringify(row.identity), source_identity: JSON.stringify(row.identity), mode: plan.mode, status: 'planned', error: '', reward: 0, day: dayKey(), created: Date.now() };
                    this.db.prepare('INSERT INTO ops(id,batch,plant,source,destination,identity,status,day,created,mode,source_identity) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(op.id, planId, op.plant, op.source, op.destination, op.identity, 'planned', op.day, op.created, plan.mode, op.source_identity);
                    this.tasks.update(taskIds[index], 'running', '', op.id);
                    this.progress.phaseAt = Date.now();
                    this.progress.phase = '파일 상태 확인 중';
                    this.onChange();
                    if (this.beforeOperation)
                        await this.beforeOperation(op);
                    if (this.cancel)
                        throw new native_1.AppError('CANCELED', '작업을 취소했어요.');
                    this.progress.phaseAt = Date.now();
                    this.progress.phase = '파일 복사·이동 중';
                    this.onChange();
                    if (!await matches(row.source, row.identity))
                        throw new native_1.AppError('CHANGED', '원본이 바뀌어 실행하지 않았어요.');
                    if (row.allowMissing)
                        (0, folder_import_1.createDestination)(plan.folder, node_path_1.default.dirname(row.destination), row.destinationAnchor, row.parentIdentity);
                    if (plan.mode === 'copy') {
                        op.temp_path = node_path_1.default.join(node_path_1.default.dirname(op.destination), `.windowsill-${op.id}.tmp`);
                        this.db.prepare('UPDATE ops SET temp_path=? WHERE id=?').run(op.temp_path, op.id);
                        await promises_1.default.copyFile(op.source, op.temp_path, node_fs_1.default.constants.COPYFILE_EXCL);
                        const handle = await promises_1.default.open(op.temp_path, 'r+');
                        try {
                            await handle.sync();
                        }
                        finally {
                            await handle.close();
                        }
                        const copied = await fingerprint(op.temp_path);
                        if (copied.hash !== row.identity.hash || !await matches(op.source, row.identity))
                            throw new native_1.AppError('CHANGED', '복사 중 원본이 바뀌었어요.');
                        op.identity = JSON.stringify(copied);
                        this.db.prepare('UPDATE ops SET identity=? WHERE id=?').run(op.identity, op.id);
                        (0, native_1.moveNoReplace)(op.temp_path, op.destination);
                    }
                    else
                        (0, native_1.moveNoReplace)(op.source, op.destination);
                    moved = true;
                    if (this.afterMove)
                        this.afterMove();
                    if (!await matches(op.destination, JSON.parse(op.identity)))
                        throw new native_1.AppError('CHANGED', '정리한 파일의 상태 확인이 필요해요.');
                    this.progress.phaseAt = Date.now();
                    this.progress.phase = '정리 기록 저장 중';
                    this.onChange();
                    if (this.afterOperation)
                        await this.afterOperation(op, plan.mode);
                    this.finish(op);
                    this.tasks.update(taskIds[index], 'completed');
                    result.push({ ...row, id: op.id, status: 'completed', taskId: taskIds[index] });
                }
                catch (error) {
                    this.onDiagnostic(error);
                    if (this.afterMove && moved)
                        throw error;
                    const canceled = !moved && error instanceof native_1.AppError && error.code === 'CANCELED';
                    if (op)
                        this.db.prepare('UPDATE ops SET status=?,error=? WHERE id=?').run(moved ? 'needs_review' : canceled ? 'not_moved' : 'failed', friendly(error), op.id);
                    if (op?.temp_path && !moved)
                        await promises_1.default.unlink(op.temp_path).catch(() => { });
                    this.tasks.update(taskIds[index], moved ? 'needs_review' : canceled ? 'canceled' : 'failed', friendly(error));
                    result.push({ ...row, status: moved ? 'needs_review' : canceled ? 'canceled' : 'failed', reason: friendly(error), taskId: taskIds[index] });
                    if (moved)
                        this.cancel = true;
                }
            }
            const out = { id: planId, rows: result };
            this.results.set(planId, out);
            return out;
        }
        finally {
            this.busy = false;
            this.progress = null;
            this.onChange();
        }
    }
    async undo(operationId) {
        this.assertReady();
        const op = this.db.prepare('SELECT * FROM ops WHERE id=?').get(operationId);
        if (!op || op.status !== 'completed')
            throw new native_1.AppError('UNDO', '되돌릴 수 있는 정리 기록이 아니에요.');
        this.busy = true;
        this.onChange();
        try {
            if (op.mode === 'copy') {
                if (!await matches(op.destination, JSON.parse(op.identity)))
                    throw new native_1.AppError('CHANGED', '사본이 바뀌었어요. 내용 버전에서 별도로 복원해 주세요.');
                const parent = (0, native_1.safePath)(node_path_1.default.dirname(op.destination), true), recovery = node_path_1.default.join(parent, '.windowsill-recovered');
                node_fs_1.default.mkdirSync(recovery, { recursive: true });
                (0, native_1.safePath)(recovery, true);
                op.recovery_path = node_path_1.default.join(recovery, `${op.id}-${node_path_1.default.basename(op.destination)}`);
                this.db.prepare("UPDATE ops SET status='undo_planned',error='UNDO:',recovery_path=? WHERE id=?").run(op.recovery_path, op.id);
                (0, native_1.moveNoReplace)(op.destination, op.recovery_path);
                if (this.afterOperation)
                    await this.afterOperation(op, 'undo-copy');
                this.db.prepare("UPDATE ops SET status='undone',error='' WHERE id=?").run(op.id);
                return this.state();
            }
            if (node_fs_1.default.existsSync(op.source))
                throw new native_1.AppError('CONFLICT', '원래 위치에 같은 이름의 파일이 있어요. 덮어쓰지 않았어요.');
            (0, native_1.safePath)(node_path_1.default.dirname(op.source), true);
            if (!await matches(op.destination, JSON.parse(op.identity)))
                throw new native_1.AppError('CHANGED', '이동 이후 파일이 수정되거나 위치가 바뀌었어요. 자동으로 되돌리지 않았어요.');
            this.db.prepare("UPDATE ops SET status='undo_planned',error='UNDO:' WHERE id=?").run(op.id);
            try {
                (0, native_1.moveNoReplace)(op.destination, op.source);
            }
            catch (error) {
                this.db.prepare("UPDATE ops SET status='completed',error='' WHERE id=?").run(op.id);
                throw error;
            }
            if (!await matches(op.source, JSON.parse(op.identity))) {
                this.db.prepare("UPDATE ops SET status='needs_review' WHERE id=?").run(op.id);
                throw new native_1.AppError('REVIEW', '되돌린 파일의 확인이 필요해요.');
            }
            if (this.afterOperation)
                await this.afterOperation(op, 'undo-move');
            this.db.prepare("UPDATE ops SET status='undone',error='' WHERE id=?").run(op.id);
            return this.state();
        }
        finally {
            this.busy = false;
            this.onChange();
        }
    }
    async recover() {
        if (this.busy)
            throw new native_1.AppError('BUSY', '현재 작업이 끝난 뒤 확인해 주세요.');
        this.busy = true;
        try {
            const ops = this.db.prepare("SELECT * FROM ops WHERE status IN ('planned','undo_planned','needs_review')").all();
            for (const op of ops) {
                const expected = JSON.parse(op.identity);
                const a = node_fs_1.default.existsSync(op.source), b = node_fs_1.default.existsSync(op.destination);
                const isUndo = op.status === 'undo_planned' || op.error.startsWith('UNDO:');
                if (op.mode === 'copy') {
                    // temp_path is persisted before the first copy write. An empty marker
                    // proves this journal entry never started copying, even if an unrelated
                    // same-name destination appeared while waiting for the version queue.
                    if (!isUndo && !op.temp_path && a && await matches(op.source, JSON.parse(op.source_identity || op.identity))) {
                        this.db.prepare("UPDATE ops SET status='not_moved',error='' WHERE id=?").run(op.id);
                        continue;
                    }
                    if (isUndo && op.recovery_path && await matches(op.recovery_path, expected) && !b) {
                        if (this.afterOperation)
                            await this.afterOperation(op, 'undo-copy');
                        this.db.prepare("UPDATE ops SET status='undone',error='' WHERE id=?").run(op.id);
                    }
                    else if (b && await matches(op.destination, expected)) {
                        if (isUndo)
                            this.db.prepare("UPDATE ops SET status='completed',error='' WHERE id=?").run(op.id);
                        else {
                            if (this.afterOperation)
                                await this.afterOperation(op, 'copy');
                            this.finish(op);
                        }
                    }
                    else if (!b && a && !isUndo) {
                        if (op.temp_path && node_fs_1.default.existsSync(op.temp_path) && await matches(op.temp_path, expected))
                            await promises_1.default.unlink(op.temp_path);
                        this.db.prepare("UPDATE ops SET status='not_moved',error='' WHERE id=?").run(op.id);
                    }
                    else
                        this.db.prepare("UPDATE ops SET status='needs_review',error=? WHERE id=?").run(`${isUndo ? 'UNDO:' : ''}복사 결과의 확인이 필요해요.`, op.id);
                    continue;
                }
                if (!a && b && await matches(op.destination, expected)) {
                    if (isUndo)
                        this.db.prepare("UPDATE ops SET status='completed',error='' WHERE id=?").run(op.id);
                    else {
                        if (this.afterOperation)
                            await this.afterOperation(op, 'move');
                        this.finish(op);
                    }
                }
                else if (a && !b && await matches(op.source, expected)) {
                    if (isUndo && this.afterOperation)
                        await this.afterOperation(op, 'undo-move');
                    this.db.prepare('UPDATE ops SET status=?,error=? WHERE id=?').run(isUndo ? 'undone' : 'not_moved', '', op.id);
                }
                else {
                    this.db.prepare("UPDATE ops SET status='needs_review',error=? WHERE id=?").run(`${isUndo ? 'UNDO:' : ''}원본과 정리 위치를 확인해 주세요.`, op.id);
                }
            }
        }
        finally {
            this.busy = false;
            this.onChange();
        }
        this.tasks.reconcile();
        return this.state();
    }
    close() { this.db.close(); }
}
exports.GardenCore = GardenCore;
