"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnostics = void 0;
exports.safeError = safeError;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const node_crypto_1 = require("node:crypto");
const events = new Set(['app.start', 'app.ready', 'app.quit', 'startup.failure', 'main.uncaught', 'main.rejection', 'renderer.error', 'renderer.rejection', 'renderer.gone', 'renderer.load', 'renderer.unresponsive', 'ipc.start', 'ipc.done', 'ipc.failure', 'files.failure', 'versions.failure', 'aftercare.failure']);
const methods = new Set(['themes', 'font', 'manage', 'bind', 'pick', 'pickFolder', 'drop', 'revise', 'execute', 'undo', 'recover', 'setting', 'openFolder', 'widget', 'manager', 'taskRetry', 'renamePlant', 'cancel', 'diagnostics']);
const codes = new Set(['PLAN', 'COUNT', 'EMPTY', 'LIMIT', 'OVERLAP', 'BOUNDARY', 'SAME', 'VOLUME', 'SIZE', 'EXPIRED', 'CANCELED', 'EACCES', 'EPERM', 'ENOENT', 'ENOSPC', 'EBUSY', 'EIO', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTDIR', 'EEXIST', 'SQLITE_BUSY', 'SQLITE_CORRUPT', 'SQLITE_FULL', 'SPACE', 'GIT', 'ROOT', 'PATH', 'FILE', 'FOLDER', 'PLANT', 'BUSY', 'REVIEW', 'DIFF', 'FONT', 'THEME', 'SETTING', 'METHOD', 'OPEN', 'VIEW', 'NAME', 'CHANGED', 'CONFLICT', 'CANCELLED']);
const commands = new Set(['organize-start', 'organize-approve', 'organize-pause', 'organize-resume', 'organize-select', 'organize-destination', 'organize-folder-approve', 'organize-review', 'aftercare-retry', 'file-management', 'scan', 'retry']);
const frames = new Set(['organizer', 'organize-worker', 'organize-policy', 'main', 'core', 'versions', 'themes', 'native', 'fonts', 'aftercare', 'tasks', 'tutorial', 'tutorial-state', 'import-planner', 'intelligence', 'diagnostics', 'diagnostic-export', 'preload', 'renderer']);
const uuid = (v) => typeof v === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(v) ? v : undefined;
const number = (v) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(86400000, Math.floor(v))) : undefined;
const version = (v) => typeof v === 'string' && /^\d+(?:\.\d+){1,3}$/.test(v) ? v : 'unknown';
// Allow known codes and application-owned frame locations only. Never persist messages,
// arguments, URLs, environment variables, native dump data or user filesystem paths.
function safeError(error) {
    let code = 'UNKNOWN', kind = 'Error', stack = [];
    try {
        const e = error;
        if (codes.has(e?.code))
            code = e.code;
        if (['Error', 'TypeError', 'RangeError', 'SyntaxError', 'ReferenceError', 'AppError'].includes(e?.name))
            kind = e.name;
        if (typeof e?.stack === 'string')
            for (const line of e.stack.slice(0, 12000).split('\n').slice(1, 20)) {
                const match = line.match(/[\\/]([a-z-]+)\.js:(\d{1,7}):(\d{1,7})\)?$/);
                if (match && frames.has(match[1]))
                    stack.push(`${match[1]}.js:${match[2]}:${match[3]}`);
                const renderer = line.match(/\/assets\/index-[\w-]+\.js:(\d{1,7}):(\d{1,7})\)?$/);
                if (renderer)
                    stack.push(`renderer.js:${renderer[1]}:${renderer[2]}`);
            }
    }
    catch { /* Untrusted error getters must not break diagnostics. */ }
    return { code, kind, frames: stack.slice(0, 8) };
}
function cleanDetails(input) {
    const result = {};
    if (!input || typeof input !== 'object')
        return result;
    if (methods.has(input.method))
        result.method = input.method;
    if (commands.has(input.command))
        result.command = input.command;
    if (uuid(input.request))
        result.request = input.request;
    if (number(input.durationMs) !== undefined)
        result.durationMs = number(input.durationMs);
    if (number(input.count) !== undefined)
        result.count = number(input.count);
    if (codes.has(input.code) || input.code === 'UNKNOWN')
        result.code = input.code;
    if (['Error', 'TypeError', 'RangeError', 'SyntaxError', 'ReferenceError', 'AppError'].includes(input.kind))
        result.kind = input.kind;
    if (Array.isArray(input.frames))
        result.frames = input.frames.filter((v) => typeof v === 'string' && /^([a-z-]+)\.js:\d{1,7}:\d{1,7}$/.test(v) && frames.has(v.split('.')[0])).slice(0, 8);
    return result;
}
class Diagnostics {
    appVersion;
    options;
    session = (0, node_crypto_1.randomUUID)();
    directory;
    memory = [];
    available = true;
    dropped = 0;
    window = 0;
    windowCount = 0;
    constructor(dataDir, appVersion, options = {}) {
        this.appVersion = appVersion;
        this.options = options;
        this.directory = node_path_1.default.join(dataDir, 'diagnostics');
    }
    now() { return this.options.now?.() ?? Date.now(); }
    file(index) { return node_path_1.default.join(this.directory, `events-${index}.jsonl`); }
    prune() { for (let i = 0; i < 3; i++) {
        const file = this.file(i);
        if (node_fs_1.default.existsSync(file) && this.now() - node_fs_1.default.statSync(file).mtimeMs > 14 * 86400000)
            node_fs_1.default.unlinkSync(file);
    } }
    record(event, details = {}) {
        try {
            if (!events.has(event))
                return;
            const now = this.now();
            if (now - this.window >= 60000) {
                this.window = now;
                this.windowCount = 0;
            }
            if (++this.windowCount > 200 && !['main.uncaught', 'startup.failure'].includes(event)) {
                this.dropped++;
                return;
            }
            const row = { time: new Date(now).toISOString(), id: (0, node_crypto_1.randomUUID)(), session: this.session, version: version(this.appVersion), event, ...cleanDetails(details) };
            this.memory.push(row);
            if (this.memory.length > 100)
                this.memory.shift();
            try {
                node_fs_1.default.mkdirSync(this.directory, { recursive: true });
                this.prune();
                const text = JSON.stringify(row) + '\n', max = this.options.maxBytes ?? 1024 * 1024;
                if (node_fs_1.default.existsSync(this.file(0)) && node_fs_1.default.statSync(this.file(0)).size + Buffer.byteLength(text) > max) {
                    if (node_fs_1.default.existsSync(this.file(2)))
                        node_fs_1.default.unlinkSync(this.file(2));
                    for (let i = 1; i >= 0; i--)
                        if (node_fs_1.default.existsSync(this.file(i)))
                            node_fs_1.default.renameSync(this.file(i), this.file(i + 1));
                }
                node_fs_1.default.appendFileSync(this.file(0), text, { encoding: 'utf8', mode: 0o600 });
                this.available = true;
            }
            catch {
                this.available = false;
            }
        }
        catch {
            this.available = false;
        }
    }
    error(event, error, details = {}) { this.record(event, { ...cleanDetails(details), ...safeError(error) }); }
    snapshot() {
        const rows = [];
        let skipped = 0;
        try {
            this.prune();
            for (let i = 2; i >= 0; i--)
                if (node_fs_1.default.existsSync(this.file(i))) {
                    if (node_fs_1.default.statSync(this.file(i)).size > 1024 * 1024 + 4096) {
                        skipped++;
                        continue;
                    }
                    for (const line of node_fs_1.default.readFileSync(this.file(i), 'utf8').split('\n')) {
                        if (!line)
                            continue;
                        try {
                            const r = JSON.parse(line);
                            if (!events.has(r.event) || !uuid(r.id) || !uuid(r.session) || typeof r.time !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(r.time) || !Number.isFinite(Date.parse(r.time)))
                                throw Error();
                            if (this.now() - Date.parse(r.time) > 14 * 86400000)
                                continue;
                            rows.push({ time: r.time, id: r.id, session: r.session, version: version(r.version), event: r.event, ...cleanDetails(r) });
                        }
                        catch {
                            skipped++;
                        }
                    }
                }
        }
        catch {
            this.available = false;
        }
        const ids = new Set(rows.map(r => r.id));
        for (const row of this.memory)
            if (!ids.has(row.id) && this.now() - Date.parse(row.time) <= 14 * 86400000)
                rows.push(row);
        rows.sort((a, b) => a.time.localeCompare(b.time));
        // Reserve room for failures even when older app versions flooded the log with polling.
        const failures = rows.filter(r => /failure|uncaught|rejection|renderer\.(error|gone|load|unresponsive)/.test(r.event)).slice(-100);
        const selected = new Map(failures.map(r => [r.id, r]));
        for (let i = rows.length - 1; i >= 0 && selected.size < 500; i--)
            selected.set(rows[i].id, rows[i]);
        const exported = [...selected.values()].sort((a, b) => a.time.localeCompare(b.time));
        return { schemaVersion: 1, reportId: (0, node_crypto_1.randomUUID)(), createdAt: new Date(this.now()).toISOString(),
            appVersion: version(this.appVersion), platform: process.platform, architecture: process.arch,
            osRelease: node_os_1.default.release().replace(/[^\d.]/g, '').slice(0, 30), runtime: { electron: version(process.versions.electron), node: version(process.versions.node), chrome: version(process.versions.chrome) },
            privacy: 'No file contents, filenames, paths, account identifiers, passwords, tokens, raw messages or database copies. No automatic upload.',
            storageAvailable: this.available, limits: { retentionDays: 14, files: 3, bytesPerFile: 1024 * 1024, exportEvents: 500 },
            omittedEvents: Math.max(0, rows.length - exported.length), rateLimitedEvents: this.dropped, unreadableRecords: skipped, events: exported };
    }
}
exports.Diagnostics = Diagnostics;
