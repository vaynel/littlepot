"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
const node_sqlite_1 = require("node:sqlite");
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const record_deletion_1 = require("./record-deletion");
const record_cleanup_1 = require("./record-cleanup");
// This worker opens only app-owned databases. It never opens the source files.
async function run() {
    const { dataDir, coreDir, git, kind, id } = node_worker_threads_1.workerData;
    const db = new node_sqlite_1.DatabaseSync(node_path_1.default.join(dataDir, 'versions.sqlite'));
    const core = new node_sqlite_1.DatabaseSync(node_path_1.default.join(coreDir, 'garden.sqlite'));
    db.exec('PRAGMA busy_timeout=10000; PRAGMA synchronous=FULL');
    core.exec('PRAGMA busy_timeout=10000; PRAGMA synchronous=FULL');
    const gitRun = (args, input) => new Promise((resolve, reject) => {
        const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')));
        const child = (0, node_child_process_1.spawn)(git, ['--git-dir', node_path_1.default.join(dataDir, 'history.git'), ...args], { windowsHide: true, env: { ...env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null', GIT_TERMINAL_PROMPT: '0', GIT_AUTHOR_NAME: 'Windowsill', GIT_AUTHOR_EMAIL: 'local@windowsill.invalid', GIT_COMMITTER_NAME: 'Windowsill', GIT_COMMITTER_EMAIL: 'local@windowsill.invalid' }, stdio: ['pipe', 'pipe', 'pipe'] });
        const out = [];
        let error = '';
        const timer = setTimeout(() => { child.kill(); reject(Error('이력 저장 응답이 늦어요. 상태를 다시 확인해 주세요.')); }, 60000);
        child.on('error', e => { clearTimeout(timer); reject(e); });
        child.stdout.on('data', (b) => out.push(b));
        child.stderr.on('data', b => { error = (error + b.toString()).slice(-2000); });
        child.stdin.on('error', () => { });
        child.on('close', code => { clearTimeout(timer); code === 0 ? resolve(Buffer.concat(out)) : reject(Error(error || 'Git 작업 실패')); });
        child.stdin.end(input);
    });
    let target;
    const deletion = new record_deletion_1.RecordDeletion(db, gitRun, t => { (0, record_cleanup_1.cleanCoreDatabase)(core, t); target = t; });
    deletion.onPhase = phase => node_worker_threads_1.parentPort.postMessage({ phase });
    try {
        const result = kind === 'recover' ? (await deletion.recover(), { cleanupPending: await deletion.compact() }) : await deletion.start(kind, id);
        node_worker_threads_1.parentPort.postMessage({ result, target });
    }
    finally {
        core.close();
        db.close();
    }
}
void run().catch(e => node_worker_threads_1.parentPort.postMessage({ error: e instanceof Error ? e.message : String(e) }));
