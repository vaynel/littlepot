"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFonts = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const native_1 = require("./native");
const limit = 20 * 1024 * 1024;
class LocalFonts {
    core;
    pending;
    constructor(core) {
        this.core = core;
    }
    filename(id) {
        if (!/^[a-f0-9]{64}$/.test(id))
            throw new native_1.AppError('FONT', '저장된 폰트를 확인할 수 없어요. 다시 가져와 주세요.');
        return node_path_1.default.join(this.core.dataDir, 'fonts', id + '.font');
    }
    async bytes(file) {
        const handle = await promises_1.default.open(file, 'r');
        try {
            const stat = await handle.stat();
            if (!stat.isFile() || stat.size < 12 || stat.size > limit)
                throw new native_1.AppError('FONT', '20MB 이하의 폰트 파일을 선택해 주세요.');
            const buffer = Buffer.alloc(stat.size + 1);
            const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
            if (bytesRead !== stat.size)
                throw new native_1.AppError('FONT', '읽는 중 파일이 바뀌었어요. 다시 선택해 주세요.');
            const bytes = buffer.subarray(0, bytesRead), signature = bytes.toString('ascii', 0, 4);
            if (bytes.readUInt32BE(0) !== 0x00010000 && !['OTTO', 'wOFF', 'wOF2'].includes(signature))
                throw new native_1.AppError('FONT', '지원하는 폰트 파일이 아니에요. TTF·OTF·WOFF·WOFF2를 선택해 주세요.');
            return bytes;
        }
        finally {
            await handle.close();
        }
    }
    async stage(file) {
        this.pending = undefined;
        if (!/\.(ttf|otf|woff2?)$/i.test(file))
            throw new native_1.AppError('FONT', 'TTF·OTF·WOFF·WOFF2 파일을 선택해 주세요.');
        const bytes = await this.bytes(file), token = (0, node_crypto_1.randomUUID)(), name = node_path_1.default.basename(file);
        this.pending = { token, name, bytes, created: Date.now() };
        return { token, name, data: bytes.toString('base64') };
    }
    async install(token) {
        const item = this.pending;
        if (!item || item.token !== token || Date.now() - item.created > 600000)
            throw new native_1.AppError('FONT', '폰트 파일을 다시 선택해 주세요.');
        this.pending = undefined;
        const id = (0, node_crypto_1.createHash)('sha256').update(item.bytes).digest('hex'), previous = this.core.setting('customFont');
        await promises_1.default.mkdir(node_path_1.default.dirname(this.filename(id)), { recursive: true });
        const temporary = this.filename(id) + '.' + (0, node_crypto_1.randomUUID)() + '.tmp';
        try {
            await promises_1.default.writeFile(temporary, item.bytes, { flag: 'wx' });
            await promises_1.default.rename(temporary, this.filename(id));
        }
        catch (error) {
            await promises_1.default.unlink(temporary).catch(() => { });
            throw error;
        }
        const meta = { id, name: item.name };
        this.core.setSetting('customFont', meta);
        this.core.onChange();
        if (previous?.id && previous.id !== id)
            await this.remove(previous.id);
        return meta;
    }
    async read() {
        const meta = this.core.setting('customFont');
        if (!meta)
            return null;
        const bytes = await this.bytes(this.filename(meta.id));
        if ((0, node_crypto_1.createHash)('sha256').update(bytes).digest('hex') !== meta.id)
            throw new native_1.AppError('FONT', '보관한 폰트가 바뀌었어요. 다시 가져와 주세요.');
        return { ...meta, data: bytes.toString('base64') };
    }
    async remove(id) { try {
        await promises_1.default.unlink(this.filename(id));
    }
    catch { /* A failed cleanup must not undo a saved preference. */ } }
    async reset() {
        this.pending = undefined;
        const previous = this.core.setting('customFont');
        this.core.setSetting('customFont', null);
        this.core.onChange();
        if (previous?.id)
            await this.remove(previous.id);
    }
}
exports.LocalFonts = LocalFonts;
