"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectMarker = exports.typeFolders = void 0;
exports.relativeFolder = relativeFolder;
exports.normalizePolicy = normalizePolicy;
exports.policyDestination = policyDestination;
const node_path_1 = __importDefault(require("node:path"));
const native_1 = require("./native");
exports.typeFolders = { documents: '문서', images: '이미지', video: '영상', audio: '음악', archives: '압축' };
const types = { documents: ['pdf', 'txt', 'md', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'hwp', 'hwpx', 'csv', 'rtf'], images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp', 'tif', 'tiff', 'svg'], video: ['mp4', 'mov', 'mkv', 'avi', 'webm'], audio: ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'], archives: ['zip', '7z', 'rar', 'tar', 'gz'] };
function relativeFolder(raw) {
    if (typeof raw !== 'string' || !raw.trim() || raw.length > 240)
        throw new native_1.AppError('POLICY', '폴더 이름을 확인해 주세요.');
    const parts = raw.trim().replace(/\\/g, '/').split('/');
    if (parts.some(p => !p || p === '.' || p === '..' || /[<>:"|?*\x00-\x1f]/.test(p) || /[. ]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p) || p.startsWith('.')) || parts.length > 8)
        throw new native_1.AppError('POLICY', '관리 폴더 안의 일반 하위 폴더 이름을 입력해 주세요.');
    return parts.join('/');
}
function normalizePolicy(input) {
    if (input === undefined)
        return { mode: 'existing', remember: true, protect: false, exclusions: [], targets: {}, terms: [], legacy: true };
    if (!input || !['existing', 'type', 'name', 'date'].includes(input.mode))
        throw new native_1.AppError('POLICY', '정리 기준을 선택해 주세요.');
    const targets = {};
    for (const key of Object.keys(exports.typeFolders))
        targets[key] = relativeFolder(input.targets?.[key] || exports.typeFolders[key]);
    if (!Array.isArray(input.exclusions) || input.exclusions.length > 40 || !Array.isArray(input.terms) || input.terms.length > 30)
        throw new native_1.AppError('POLICY', '정리 범위와 이름 단어를 확인해 주세요.');
    const terms = input.terms.map((r) => { const word = typeof r.word === 'string' ? r.word.trim().normalize('NFKC').toLocaleLowerCase() : ''; if (!word || word.length > 40)
        throw new native_1.AppError('POLICY', '이름 단어를 입력해 주세요.'); return { word, folder: relativeFolder(r.folder) }; });
    if (input.mode === 'name' && !terms.length)
        throw new native_1.AppError('POLICY', '이름 단어와 목적지를 한 개 이상 지정해 주세요.');
    return { mode: input.mode, remember: input.remember === true, protect: input.protect !== false, exclusions: input.exclusions.map(relativeFolder), targets, terms };
}
function policyDestination(policy, source) {
    const name = node_path_1.default.basename(source).normalize('NFKC').toLocaleLowerCase(), ext = node_path_1.default.extname(name).slice(1);
    if (policy.mode === 'type') {
        const kind = Object.keys(types).find(k => types[k].includes(ext));
        return kind ? { relative: policy.targets[kind] || exports.typeFolders[kind], reason: '확장자에 따른 파일 종류 기준이에요.' } : { relative: '', reason: '분류할 수 없는 파일 형식이에요. 직접 확인해 주세요.' };
    }
    if (policy.mode === 'name') {
        const matches = [...new Set(policy.terms.filter(x => name.includes(x.word)).map(x => x.folder))];
        return matches.length === 1 ? { relative: matches[0], reason: '내가 지정한 이름 단어와 일치해요.' } : { relative: '', reason: matches.length ? '이름 단어가 여러 목적지와 일치해요.' : '지정한 이름 단어가 없어요.' };
    }
    if (policy.mode === 'date') {
        const raw = [...name.matchAll(/(?<!\d)(\d{4})(?:-(\d{2})-(\d{2})|(\d{2})(\d{2}))(?!\d)/g)];
        if (raw.length !== 1)
            return { relative: '', reason: '파일명에 날짜가 없거나 여러 개예요.' };
        const m = raw[0], y = Number(m[1]), month = Number(m[2] || m[4]), day = Number(m[3] || m[5]), d = new Date(Date.UTC(y, month - 1, day));
        if (y < 1900 || y > 9999 || d.getUTCFullYear() !== y || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day)
            return { relative: '', reason: '파일명 날짜가 올바르지 않아요.' };
        return { relative: `${y}/${String(month).padStart(2, '0')}`, reason: '파일명에 있는 유효한 날짜의 연도와 월이에요.' };
    }
    return { relative: '', reason: '' };
}
const projectMarker = (name) => ['.git', '.obsidian', 'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod'].includes(name) || /\.(sln|xcodeproj|app)$/i.test(name);
exports.projectMarker = projectMarker;
