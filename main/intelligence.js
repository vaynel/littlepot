"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intelligence = void 0;
exports.inferTemplate = inferTemplate;
exports.checkName = checkName;
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const versions_1 = require("./versions");
const native_1 = require("./native");
const recommendation_1 = require("./recommendation");
const quoted = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tokens = (name) => name.toLocaleLowerCase().replace(/최종|사본|final|copy/g, '').match(/[\p{L}\p{N}]+/gu) || [];
const patternKey = (file) => tokens(node_path_1.default.basename(file, node_path_1.default.extname(file))).map(t => /^\d+$/.test(t) ? '#' : t).join('|') + node_path_1.default.extname(file).toLowerCase();
function dateValid(raw) {
    const digits = raw.replace(/[-.]/g, '');
    const y = Number(digits.slice(0, 4)), m = Number(digits.slice(4, 6)), d = Number(digits.slice(6, 8));
    const dt = new Date(Date.UTC(y, m - 1, d));
    return digits.length === 8 && dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}
function inferTemplate(name) {
    const ext = node_path_1.default.extname(name);
    let stem = node_path_1.default.basename(name, ext);
    stem = stem.replace(/\d{4}([- .]?)\d{2}\1\d{2}/g, v => dateValid(v) ? '§' : v);
    return stem.replace(/[\p{L}]+/gu, '{텍스트}').replace(/\d+/g, '{번호}').replace(/§/g, '{날짜}') + ext.toLowerCase();
}
function checkName(name, template) {
    const parts = template.split(/(\{[^{}]+\})/);
    let regex = '^';
    const dateGroups = [];
    let group = 0;
    for (const part of parts) {
        if (/^\{.*\}$/.test(part)) {
            group++;
            if (part === '{날짜}') {
                regex += '(\\d{4}(?:[-.]?\\d{2}){2})';
                dateGroups.push(group);
            }
            else if (part === '{번호}')
                regex += '(\\d+)';
            else
                regex += '([^_\\/]+?)';
        }
        else
            regex += quoted(part);
    }
    const match = new RegExp(regex + '$', 'u').exec(name);
    if (!match)
        return { status: 'mismatch', reason: '필수 구간·순서·구분자·확장자가 규칙과 달라요.' };
    if (dateGroups.some(i => !dateValid(match[i])))
        return { status: 'mismatch', reason: '유효한 날짜가 아니에요.' };
    return { status: 'match', reason: '파일명 형식이 일치해요. 내용의 의미를 판정한 결과는 아니에요.' };
}
class Intelligence {
    store;
    routing;
    constructor(store) {
        this.store = store;
        this.routing = new recommendation_1.Recommendations(store);
    }
    async recommend(rootId, source, batchFolders) { return this.routing.recommend(rootId, source, batchFolders); }
    learn(op, root, source, destination, weight, hash) {
        const folder = node_path_1.default.dirname(destination), key = patternKey(source);
        // Copies of the same content do not accumulate hundreds of independent votes.
        const dedup = `${root}:${hash}:${folder}`;
        if (this.store.db.prepare('SELECT op FROM learned_ops WHERE op=? OR op=?').get(op, dedup))
            return;
        this.store.db.exec('BEGIN IMMEDIATE');
        try {
            this.store.db.prepare('INSERT INTO learned_ops VALUES (?,?,?,?,?,1)').run(op, root, key, folder, weight);
            this.store.db.prepare('INSERT OR IGNORE INTO learned_ops VALUES (?,?,?,?,0,0)').run(dedup, root, key, folder);
            this.store.db.prepare('INSERT INTO preferences VALUES (?,?,?,?,?) ON CONFLICT(root,pattern,folder) DO UPDATE SET count=count+excluded.count,updated=excluded.updated').run(root, key, folder, weight, Date.now());
            this.store.db.exec('COMMIT');
        }
        catch (e) {
            this.store.db.exec('ROLLBACK');
            throw e;
        }
    }
    unlearn(op) {
        const row = this.store.db.prepare('SELECT * FROM learned_ops WHERE op=? AND active=1').get(op);
        if (!row)
            return;
        this.store.db.exec('BEGIN IMMEDIATE');
        try {
            this.store.db.prepare('UPDATE preferences SET count=MAX(0,count-?) WHERE root=? AND pattern=? AND folder=?').run(row.weight, row.root, row.pattern, row.folder);
            this.store.db.prepare('UPDATE learned_ops SET active=0 WHERE op=?').run(op);
            this.store.db.exec('COMMIT');
        }
        catch (e) {
            this.store.db.exec('ROLLBACK');
            throw e;
        }
    }
    reset(root) { this.store.root(root); this.store.db.prepare('DELETE FROM preferences WHERE root=?').run(root); this.store.db.prepare('UPDATE learned_ops SET active=0 WHERE root=?').run(root); }
    analyze(rootId) {
        const root = this.store.root(rootId);
        const files = this.store.list(rootId);
        const active = files.filter(f => !['deleted', 'replaced'].includes(f.status));
        const rules = this.store.db.prepare('SELECT * FROM rules WHERE root=? AND active=1').all(rootId);
        const exceptions = new Set(this.store.db.prepare('SELECT e.file,e.rule,e.revision FROM exceptions e JOIN files f ON f.id=e.file WHERE f.root=?').all(rootId).map(e => `${e.file}\0${e.rule}\0${e.revision}`));
        const groups = new Map();
        const rows = active.map(f => {
            const name = node_path_1.default.basename(f.path), scope = node_path_1.default.dirname(f.path), template = inferTemplate(name), key = `${scope}\0${template}`;
            const group = groups.get(key) || { template, scope, count: 0, examples: [], unique: new Set() };
            const unique = f.hash ? `${f.hash}:${template}` : f.id;
            if (!group.unique.has(unique)) {
                group.count++;
                group.unique.add(unique);
                if (group.examples.length < 3)
                    group.examples.push(name);
            }
            groups.set(key, group);
            const applicable = rules.filter(r => (0, versions_1.inside)(r.scope, f.path)).sort((a, b) => b.scope.length - a.scope.length);
            const rule = applicable[0];
            let result = { status: 'none', reason: '이 범위에 승인한 규칙이 없어요.' };
            if (rule) {
                if (applicable[1]?.scope.length === rule.scope.length)
                    result = { status: 'review', reason: '같은 범위의 규칙이 충돌해요.' };
                else if (exceptions.has(`${f.id}\0${rule.id}\0${rule.revision}`))
                    result = { status: 'exception', reason: '이 파일은 사용자가 지정한 예외예요.' };
                else
                    result = checkName(name, rule.template);
            }
            return { ...f, name, ...result, versionStatus: f.status, rule: rule?.id || '', revision: rule?.revision || 0, template: rule?.template || '' };
        });
        return { root, rules, routing: this.routing.list(rootId), folders: this.store.browseFolders(rootId), candidates: [...groups.values()].filter(g => g.count >= 5 && !rules.some(r => r.scope === g.scope && r.template === g.template)).map(({ unique, ...g }) => g), rows, habits: this.store.db.prepare('SELECT * FROM preferences WHERE root=? AND count>0 ORDER BY count DESC LIMIT 30').all(rootId) };
    }
    approve(rootId, scope, template) {
        const root = this.store.root(rootId);
        (0, native_1.safeManagedPath)(scope, true);
        if (!(0, versions_1.inside)(root.path, scope) || typeof template !== 'string' || template.length > 180 || !template.trim() || /[\/\0]/.test(template) || /\{[^{}]*\{|\}[^{}]*\}/.test(template))
            throw new native_1.AppError('RULE', '관리 범위와 파일명 형식을 확인해 주세요.');
        const fields = template.match(/\{[^{}]+\}/g) || [];
        if (fields.some(f => !['{텍스트}', '{날짜}', '{번호}', '{거래처}', '{문서종류}'].includes(f)))
            throw new native_1.AppError('RULE', '{텍스트}, {날짜}, {번호}, {거래처}, {문서종류}를 사용할 수 있어요.');
        const old = this.store.db.prepare('SELECT * FROM rules WHERE root=? AND scope=?').get(rootId, scope);
        this.store.db.prepare('INSERT INTO rules VALUES (?,?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET template=excluded.template,revision=excluded.revision,active=1').run(old?.id || (0, node_crypto_1.randomUUID)(), rootId, scope, template, (old?.revision || 0) + 1);
        return this.analyze(rootId);
    }
    exception(fileId, enabled) {
        const f = this.store.db.prepare('SELECT * FROM files WHERE id=?').get(fileId);
        if (!f)
            throw new native_1.AppError('FILE', '파일을 확인해 주세요.');
        const row = this.analyze(f.root).rows.find(r => r.id === fileId);
        if (!row?.rule)
            throw new native_1.AppError('RULE', '적용할 규칙이 없어요.');
        if (enabled)
            this.store.db.prepare('INSERT OR IGNORE INTO exceptions VALUES (?,?,?)').run(fileId, row.rule, row.revision);
        else
            this.store.db.prepare('DELETE FROM exceptions WHERE file=? AND rule=?').run(fileId, row.rule);
    }
    disable(rule) { this.store.db.prepare('UPDATE rules SET active=0 WHERE id=?').run(rule); }
}
exports.Intelligence = Intelligence;
