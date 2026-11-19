"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeManagedPath = exports.AppError = void 0;
exports.safePath = safePath;
exports.needsContentVerification = needsContentVerification;
exports.moveNoReplace = moveNoReplace;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const koffi_1 = __importDefault(require("koffi"));
class AppError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.AppError = AppError;
let move;
let attributes;
let checkVolume;
function init() {
    if (move)
        return;
    if (process.platform === 'win32') {
        const dll = koffi_1.default.load('kernel32.dll');
        const rename = dll.func('__stdcall', 'MoveFileExW', 'bool', ['str16', 'str16', 'uint']);
        const last = dll.func('__stdcall', 'GetLastError', 'uint', []);
        attributes = dll.func('__stdcall', 'GetFileAttributesW', 'uint', ['str16']);
        const drive = dll.func('__stdcall', 'GetDriveTypeW', 'uint', ['str16']);
        const volume = dll.func('__stdcall', 'GetVolumeInformationW', 'bool', ['str16', 'void *', 'uint', 'void *', 'void *', 'void *', 'void *', 'uint']);
        checkVolume = (file, managed = false) => {
            const root = node_path_1.default.parse(file).root;
            const name = Buffer.alloc(64);
            const kind = drive(root);
            if (![2, 3].includes(kind) || !volume(root, null, 0, null, null, null, name, 32)) {
                throw new AppError('UNSUPPORTED', '연결된 로컬 드라이브인지 확인해 주세요.');
            }
            const format = name.toString('utf16le').split('\0')[0].toUpperCase();
            if (format !== 'NTFS' && !(managed && format === 'EXFAT'))
                throw new AppError('UNSUPPORTED', managed ? '관리 폴더는 로컬 NTFS 또는 exFAT 드라이브에서 사용할 수 있어요.' : '파일 정리는 NTFS에서 지원해요. exFAT 폴더는 버전 보관과 다른 이름으로 복원을 사용할 수 있어요.');
            return format;
        };
        move = (from, to) => {
            if (!rename(from, to, 0)) {
                const code = last();
                throw new AppError(code === 183 || code === 80 ? 'CONFLICT' : 'MOVE_FAILED', `파일을 옮기지 못했어요. 사용 중이거나 권한이 없는지 확인해 주세요. (OS ${code})`);
            }
        };
    }
    else if (process.platform === 'linux') {
        const lib = koffi_1.default.load('libc.so.6');
        const rename = lib.func('int renameat2(int, const char *, int, const char *, unsigned int)');
        checkVolume = file => { if (Number(node_fs_1.default.statfsSync(file).type) !== 0xef53)
            throw new AppError('UNSUPPORTED', '프로토타입은 로컬 ext4 파일시스템을 지원해요.'); };
        move = (a, b) => { if (rename(-100, a, -100, b, 1) !== 0)
            throw new AppError('MOVE_FAILED', `파일 이동이 거절됐어요. (${koffi_1.default.errno()})`); };
    }
    else if (process.platform === 'darwin') {
        const lib = koffi_1.default.load('/usr/lib/libSystem.B.dylib');
        const rename = lib.func('int renamex_np(const char *, const char *, unsigned int)');
        checkVolume = file => { if (Number(node_fs_1.default.statfsSync(file).type) !== 26)
            throw new AppError('UNSUPPORTED', '프로토타입은 로컬 APFS 파일시스템을 지원해요.'); };
        move = (a, b) => { if (rename(a, b, 4) !== 0)
            throw new AppError('MOVE_FAILED', `파일 이동이 거절됐어요. (${koffi_1.default.errno()})`); };
    }
    else
        throw new AppError('UNSUPPORTED', '이 운영체제는 아직 지원하지 않아요.');
}
function safePath(input, directory = false, managed = false) {
    init();
    if (typeof input !== 'string' || !node_path_1.default.isAbsolute(input) || input.includes('\0') || input.includes('\ufffd'))
        throw new AppError('PATH', '파일 경로를 확인할 수 없어요.');
    const normalized = node_path_1.default.resolve(input);
    const protectedRoots = process.platform === 'win32'
        ? [process.env.SystemRoot, process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.ProgramData].filter(Boolean)
        : ['/System', '/Library', '/usr', '/bin', '/sbin', '/etc', '/proc', '/sys', '/dev'];
    for (const root of protectedRoots) {
        const relative = node_path_1.default.relative(root, normalized);
        if (!relative || (!relative.startsWith('..') && !node_path_1.default.isAbsolute(relative)))
            throw new AppError('SYSTEM', '시스템 폴더는 정리 대상으로 사용할 수 없어요.');
    }
    // Inspect each component before resolving links. The prototype rejects all user links.
    let cursor = normalized;
    while (cursor !== node_path_1.default.dirname(cursor)) {
        const stat = node_fs_1.default.lstatSync(cursor);
        if (stat.isSymbolicLink())
            throw new AppError('LINK', '바로가기나 연결된 경로는 아직 지원하지 않아요.');
        if (attributes) {
            const attr = attributes(cursor);
            if (attr === 0xffffffff || (attr & (0x400 | 0x1000 | 0x40000 | 0x400000)))
                throw new AppError('LINK', '클라우드 또는 연결된 경로는 아직 지원하지 않아요.');
        }
        cursor = node_path_1.default.dirname(cursor);
    }
    const stat = node_fs_1.default.statSync(normalized);
    if (directory ? !stat.isDirectory() : !stat.isFile())
        throw new AppError('TYPE', directory ? '폴더를 선택해 주세요.' : stat.isDirectory() ? '폴더 자체는 복사·이동할 수 없어요. 폴더 안의 파일을 놓거나, 관리 파일·버전에서 이 폴더를 관리 폴더로 추가해 주세요.' : '일반 파일만 정리할 수 있어요.');
    if (directory && normalized === node_path_1.default.parse(normalized).root)
        throw new AppError('ROOT', '드라이브 전체 대신 정리할 폴더를 선택해 주세요.');
    checkVolume?.(normalized, managed);
    return normalized;
}
// Reading/version capture does not require stable identities across directory moves.
// Keep transfer paths strict until their recovery journal supports exFAT identity changes.
const safeManagedPath = (input, directory = false) => safePath(input, directory, true);
exports.safeManagedPath = safeManagedPath;
function needsContentVerification(file) { init(); return checkVolume?.(file, true) === 'EXFAT'; }
function moveNoReplace(from, to) {
    init();
    move(from, to);
}
