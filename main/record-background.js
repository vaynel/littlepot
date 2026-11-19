"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordBackground = recordBackground;
const node_worker_threads_1 = require("node:worker_threads");
const node_path_1 = __importDefault(require("node:path"));
function recordBackground(dataDir, coreDir, git, kind, id, onPhase) {
    return new Promise((resolve, reject) => {
        const worker = new node_worker_threads_1.Worker(node_path_1.default.join(__dirname, 'record-worker.js'), { workerData: { dataDir, coreDir, git, kind, id } });
        let response, failure;
        worker.on('message', m => { if (m.phase)
            onPhase(m.phase);
        else if (m.error)
            failure = Error(m.error);
        else
            response = m; });
        worker.on('error', e => { failure = e; });
        // Wait for DB handles to close before resuming writers or shutting the app down.
        worker.on('exit', code => { if (failure)
            reject(failure);
        else if (code !== 0 || !response)
            reject(Error('기록 삭제 작업이 중단됐어요. 다시 확인해 주세요.'));
        else
            resolve(response); });
    });
}
