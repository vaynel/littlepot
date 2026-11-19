"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recommendations = exports.nameTokens = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const native_1 = require("./native");
const versions_1 = require("./versions");
const normalize = (s) => s.normalize('NFKC').toLocaleLowerCase();
const generic = new Set(['img', 'dsc', 'image', 'scan', 'screenshot', 'final', 'copy', '최종', '사본', '새', '문서', 'untitled', 'new']);
const nameTokens = (s) => [...new Set((normalize(s).match(/[\p{L}\p{N}]+/gu) || []).filter(t => t.length > 1 && !/^\d+$|^v\d+$/.test(t) && !generic.has(t)))];
exports.nameTokens = nameTokens;
class Recommendations {
    store;
    constructor(store) {
        this.store = store;
        store.db.exec(`CREATE TABLE IF NOT EXISTS routing_rules(id TEXT PRIMARY KEY,root TEXT NOT NULL,keywords TEXT NOT NULL,extension TEXT NOT NULL,folder TEXT NOT NULL,enabled INTEGER NOT NULL,created INTEGER NOT NULL,updated INTEGER NOT NULL);`);
    }
    list(rootId) { this.store.root(rootId); return this.store.db.prepare('SELECT * FROM routing_rules WHERE root=? ORDER BY updated DESC').all(rootId).map(r => ({ ...r, keywords: JSON.parse(r.keywords) })); }
    save(rootId, input) {
        const root = this.store.root(rootId);
        if (!input || typeof input.keywords !== 'string' || typeof input.extension !== 'string' || typeof input.folder !== 'string' || typeof input.id !== 'string')
            throw new native_1.AppError('RULE', '분류 규칙의 조건과 폴더를 확인해 주세요.');
        const words = [...new Set(input.keywords.split(',').map((x) => normalize(x.trim())).filter(Boolean))];
        const extension = normalize(input.extension.trim()).replace(/^\./, '');
        if (!words.length || words.length > 5 || words.some((x) => x.length > 40 || !/[\p{L}\p{N}]/u.test(x) || /[\x00-\x1f/\\]/.test(x)) || extension && !/^[a-z0-9]{1,12}$/.test(extension))
            throw new native_1.AppError('RULE', '이름 단어는 쉼표로 최대 5개, 확장자는 pdf처럼 입력해 주세요.');
        const folder = (0, native_1.safeManagedPath)(input.folder, true);
        if (!(0, versions_1.inside)(root.path, folder))
            throw new native_1.AppError('RULE', '관리 폴더 안의 목적지를 선택해 주세요.');
        if (input.id && !this.store.db.prepare('SELECT id FROM routing_rules WHERE id=? AND root=?').get(input.id, rootId))
            throw new native_1.AppError('RULE', '수정할 분류 규칙을 찾지 못했어요.');
        const id = input.id || (0, node_crypto_1.randomUUID)(), now = Date.now();
        this.store.db.prepare('INSERT INTO routing_rules VALUES (?,?,?,?,?,1,?,?) ON CONFLICT(id) DO UPDATE SET keywords=excluded.keywords,extension=excluded.extension,folder=excluded.folder,enabled=1,updated=excluded.updated').run(id, rootId, JSON.stringify(words), extension, folder, now, now);
        return this.list(rootId);
    }
    toggle(rootId, id, enabled) { this.store.root(rootId); if (typeof enabled !== 'boolean' || !this.store.db.prepare('SELECT id FROM routing_rules WHERE root=? AND id=?').get(rootId, id))
        throw new native_1.AppError('RULE', '분류 규칙을 확인해 주세요.'); this.store.db.prepare('UPDATE routing_rules SET enabled=?,updated=? WHERE id=?').run(enabled ? 1 : 0, Date.now(), id); }
    async recommend(rootId, source, batchFolders) {
        const root = this.store.root(rootId), folders = [...new Set(batchFolders ?? await this.store.folders(rootId))].filter(f => (0, versions_1.inside)(root.path, f));
        const ext = normalize(node_path_1.default.extname(source)).slice(1), stem = normalize(node_path_1.default.basename(source, node_path_1.default.extname(source))), fileTokens = (0, exports.nameTokens)(stem);
        const choices = this.store.db.prepare('SELECT * FROM preferences WHERE root=? AND count>0').all(rootId);
        const manual = this.list(rootId).filter(r => r.enabled && folders.includes(r.folder) && (!r.extension || r.extension === ext) && r.keywords.every((w) => stem.includes(w)));
        const destinations = new Set(manual.map(r => r.folder)), conflict = destinations.size > 1;
        const scored = folders.map(folder => {
            const ft = (0, exports.nameTokens)(node_path_1.default.relative(root.path, folder)), matches = fileTokens.filter(t => ft.some(f => f === t || f.includes(t) || t.includes(f)));
            let historical = 0;
            for (const c of choices) {
                if (c.folder !== folder)
                    continue;
                const previousExt = node_path_1.default.extname(c.pattern).slice(1).toLowerCase();
                if (previousExt !== ext)
                    continue;
                const past = (0, exports.nameTokens)(c.pattern.slice(0, previousExt ? -(previousExt.length + 1) : undefined).replace(/\|/g, ' '));
                const overlap = fileTokens.filter(t => past.includes(t)).length;
                const similarity = overlap / Math.max(1, new Set([...fileTokens, ...past]).size);
                historical += c.count * similarity * Math.pow(.5, Math.max(0, Date.now() - c.updated) / (90 * 86400000));
            }
            const explicit = destinations.has(folder), score = (explicit ? 100 : 0) + matches.length * 2 + Math.min(6, historical * 1.2);
            return { folder, score, explicit, matches, evidenceWeight: Math.round(historical * 10) / 10, reason: explicit ? '직접 만든 분류 규칙과 일치해요.' : historical >= 1 ? '같은 확장자의 비슷한 이름을 정리한 이력을 반영했어요.' : matches.length ? '파일명과 폴더명의 단어가 일치해요.' : '이름만으로 위치를 정하기 어려워요. 직접 선택해 주세요.' };
        }).sort((a, b) => b.score - a.score || a.folder.localeCompare(b.folder));
        const strong = !conflict && (destinations.size === 1 || scored[0]?.score >= 2 && (!scored[1] || scored[0].score - scored[1].score >= 1));
        const existing = new Set(folders.map(f => normalize(node_path_1.default.basename(f))));
        const names = [...fileTokens.slice(0, 3), ...(fileTokens.length >= 2 ? [fileTokens.slice(0, 2).join('_')] : [])].filter(s => s.length <= 40 && !existing.has(s) && !/[<>:"/\\|?*]/.test(s) && !s.endsWith('.'));
        return { candidates: scored.slice(0, 3), folders, selected: strong ? scored[0].folder : '', confidence: conflict ? 'conflict' : strong ? 'clear' : 'review', folderNames: [...new Set(names)].slice(0, 3) };
    }
}
exports.Recommendations = Recommendations;
