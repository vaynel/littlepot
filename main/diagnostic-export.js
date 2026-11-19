"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticExport = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const native_1 = require("./native");
// Export exactly the reviewed snapshot; never overwrite a user's existing file.
class DiagnosticExport {
    logs;
    dataDir;
    now;
    previews = new Map();
    constructor(logs, dataDir, now = () => Date.now()) {
        this.logs = logs;
        this.dataDir = dataDir;
        this.now = now;
    }
    forget(sender) { this.previews.delete(sender); }
    preview(sender) { const report = this.logs.snapshot(), text = JSON.stringify(report, null, 2); this.previews.set(sender, { token: report.reportId, text, created: this.now() }); return { token: report.reportId, text, storageAvailable: report.storageAvailable }; }
    reviewed(sender, token) { const p = this.previews.get(sender); if (!p || p.token !== token || this.now() - p.created > 600000)
        throw new native_1.AppError('REVIEW', '진단 내용을 다시 확인해 주세요.'); return p; }
    async save(sender, token, target) {
        const p = this.reviewed(sender, token), output = target.toLowerCase().endsWith('.json') ? target : target + '.json';
        const parent = await promises_1.default.realpath(node_path_1.default.dirname(output)), data = await promises_1.default.realpath(this.dataDir), relative = node_path_1.default.relative(data, parent);
        if (!relative || (!relative.startsWith('..' + node_path_1.default.sep) && relative !== '..' && !node_path_1.default.isAbsolute(relative)))
            throw new native_1.AppError('PATH', '앱 기록 폴더 밖에 저장해 주세요.');
        let handle;
        try {
            handle = await promises_1.default.open(node_path_1.default.join(parent, node_path_1.default.basename(output)), 'wx', 0o600);
        }
        catch (e) {
            if (e?.code === 'EEXIST')
                throw new native_1.AppError('CONFLICT', '같은 이름의 파일이 있어요. 다른 이름으로 저장해 주세요.');
            throw e;
        }
        try {
            await handle.writeFile(p.text, 'utf8');
            await handle.sync();
        }
        catch (e) {
            await handle.close();
            await promises_1.default.unlink(node_path_1.default.join(parent, node_path_1.default.basename(output))).catch(() => { });
            throw e;
        }
        await handle.close();
        this.forget(sender);
        return { saved: true };
    }
}
exports.DiagnosticExport = DiagnosticExport;
