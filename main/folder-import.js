"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderIdentity = exports.contains = exports.IMPORT_LIMIT = void 0;
exports.collectImport = collectImport;
exports.inspectDestination = inspectDestination;
exports.createDestination = createDestination;
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const native_1 = require("./native");
exports.IMPORT_LIMIT = 200;
const excluded = new Set(['.git', 'node_modules', '.windowsill-recovered', '.DS_Store']);
const key = (p) => process.platform === 'linux' ? p : p.toLowerCase();
const contains = (root, p) => { const r = node_path_1.default.relative(root, p); return r === '' || (!r.startsWith('..' + node_path_1.default.sep) && r !== '..' && !node_path_1.default.isAbsolute(r)); };
exports.contains = contains;
const folderIdentity = (p) => { const s = node_fs_1.default.statSync((0, native_1.safePath)(p, true), { bigint: true }); return `${s.dev}:${s.ino}:${s.birthtimeNs}`; };
exports.folderIdentity = folderIdentity;
async function collectImport(inputs, destination, canceled = () => false) {
    if (!Array.isArray(inputs) || !inputs.length || inputs.length > 20)
        throw new native_1.AppError('COUNT', '한 번에 파일·폴더 1~20개를 넣어 주세요.');
    const result = { files: [], relative: {}, folders: 0, empty: 0, excluded: 0, issues: [] }, seen = new Set(), covered = [];
    let visited = 0;
    const issue = (p, reason) => { result.excluded++; if (result.issues.length < 30)
        result.issues.push({ path: p, reason }); };
    async function walk(input, relative, depth) {
        if (canceled())
            throw new native_1.AppError('CANCELED', '작업을 취소했어요.');
        if (++visited > 10000)
            throw new native_1.AppError('LIMIT', '탐색 항목이 너무 많아요. 더 작은 폴더로 나누어 주세요.');
        if (depth > 32) {
            issue(relative, '폴더 깊이 제한으로 제외했어요.');
            return;
        }
        try {
            const s = await promises_1.default.lstat(input);
            if (s.isSymbolicLink()) {
                issue(relative, '연결 경로는 제외했어요.');
                return;
            }
            if (s.isDirectory()) {
                const dir = (0, native_1.safePath)(input, true);
                if ((0, exports.contains)(dir, destination))
                    throw new native_1.AppError('OVERLAP', '정리할 폴더 안에 목적지 관리 폴더가 있어요. 다른 폴더를 선택해 주세요.');
                let count = 0;
                const handle = await promises_1.default.opendir(dir);
                for await (const e of handle) {
                    count++;
                    if (excluded.has(e.name) || e.name.startsWith('.windowsill-')) {
                        issue(node_path_1.default.join(relative, e.name), '기본 제외 항목이에요.');
                        continue;
                    }
                    await walk(node_path_1.default.join(dir, e.name), node_path_1.default.join(relative, e.name), depth + 1);
                }
                if (!count)
                    result.empty++;
            }
            else if (s.isFile()) {
                const file = (0, native_1.safePath)(input);
                if (seen.has(key(file)))
                    return;
                seen.add(key(file));
                if (result.files.length >= exports.IMPORT_LIMIT)
                    throw new native_1.AppError('LIMIT', '파일이 200개를 넘어요. 더 작은 폴더로 나누어 주세요.');
                result.files.push(file);
                result.relative[file] = relative;
            }
            else
                issue(relative, '일반 파일이 아니어서 제외했어요.');
        }
        catch (e) {
            if (e instanceof native_1.AppError && ['LIMIT', 'CANCELED', 'OVERLAP'].includes(e.code))
                throw e;
            issue(relative, e instanceof native_1.AppError ? e.message : '접근할 수 없어 제외했어요.');
        }
    }
    // Parents first: dropping both a folder and one of its children keeps one copy.
    const paths = inputs.map(p => { if (typeof p !== 'string' || !node_path_1.default.isAbsolute(p))
        throw new native_1.AppError('PATH', '파일 경로를 확인할 수 없어요.'); return node_path_1.default.resolve(p); }).sort((a, b) => a.length - b.length || a.localeCompare(b));
    for (const p of paths) {
        if (covered.some(d => (0, exports.contains)(d, p)))
            continue;
        let dir = false;
        try {
            dir = (await promises_1.default.lstat(p)).isDirectory();
        }
        catch { }
        if (dir) {
            covered.push(p);
            result.folders++;
        }
        await walk(p, node_path_1.default.basename(p), 0);
    }
    return result;
}
/** Preview only: capture the last existing ancestor without creating a directory. */
function inspectDestination(root, target, allowMissing = false) {
    const normalized = node_path_1.default.resolve(target);
    if (!(0, exports.contains)(root, normalized))
        throw new native_1.AppError('BOUNDARY', '연결된 루트 안에서 폴더를 선택해 주세요.');
    let anchor = normalized;
    while (true) {
        try {
            node_fs_1.default.lstatSync(anchor);
            break;
        }
        catch (e) {
            if (e.code !== 'ENOENT' || !allowMissing)
                throw e;
            anchor = node_path_1.default.dirname(anchor);
        }
    }
    anchor = (0, native_1.safePath)(anchor, true);
    if (!(0, exports.contains)(root, anchor))
        throw new native_1.AppError('BOUNDARY', '연결된 루트 안에서 폴더를 선택해 주세요.');
    return { target: normalized, anchor, identity: (0, exports.folderIdentity)(anchor) };
}
function createDestination(root, target, anchor, identity) {
    if (!(0, exports.contains)(root, target) || !(0, exports.contains)(root, anchor) || !(0, exports.contains)(anchor, target) || (0, exports.folderIdentity)(anchor) !== identity)
        throw new native_1.AppError('CHANGED', '목적지 폴더가 바뀌었어요.');
    let cursor = anchor;
    for (const part of node_path_1.default.relative(anchor, target).split(node_path_1.default.sep).filter(Boolean)) {
        cursor = node_path_1.default.join(cursor, part);
        try {
            node_fs_1.default.mkdirSync(cursor);
        }
        catch (e) {
            if (e.code !== 'EEXIST')
                throw e;
        }
        (0, native_1.safePath)(cursor, true);
    }
    return (0, native_1.safePath)(target, true);
}
