"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Themes = void 0;
const builtin_themes_1 = require("./builtin-themes");
const theme_connection_1 = require("./theme-connection");
const native_1 = require("./native");
const themeError = (message) => new native_1.AppError('THEME', message);
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_worker_threads_1 = require("node:worker_threads");
const node_crypto_1 = require("node:crypto");
const LIMIT = 5 * 1024 * 1024;
const emptySelection = () => ({ main: null, widget: null, font: null, preferences: {} });
class Themes {
    directory;
    version;
    changed;
    guideSeen = false;
    token = '';
    user = null;
    pending = false;
    catalogDigests = new Map();
    active = null;
    entries = [];
    selection = emptySelection();
    previous = null;
    revision = 0;
    applied = { main: null, widget: null, font: null };
    connection = new theme_connection_1.ThemeConnection();
    constructor(directory, version, changed) {
        this.directory = directory;
        this.version = version;
        this.changed = changed;
    }
    get endpoint() { return this.connection.status().endpoint; }
    async init() {
        await promises_1.default.mkdir(this.directory, { recursive: true });
        for (const file of await promises_1.default.readdir(this.directory)) {
            if (!/^[a-f0-9]{64}\.silltheme$/.test(file))
                continue;
            try {
                const bytes = await this.readLimited(node_path_1.default.join(this.directory, file)), v = await this.validate(bytes);
                if (file !== v.digest + '.silltheme')
                    continue;
                this.entries.push({ id: v.digest, title: v.manifest.title, version: v.manifest.version, scopes: this.scopes(v.manifest) });
            }
            catch { /* Damaged packages are never rendered. */ }
        }
        try {
            this.guideSeen = (await promises_1.default.readFile(node_path_1.default.join(this.directory, 'guide-version'), 'utf8')) === '2';
        }
        catch { }
        try {
            const saved = JSON.parse(await promises_1.default.readFile(node_path_1.default.join(this.directory, 'selection.json'), 'utf8'));
            this.selection = this.checkSelection(saved.current);
            try {
                this.previous = saved.previous ? this.checkSelection(saved.previous) : null;
            }
            catch {
                this.previous = null;
            }
            await this.resolveSelection();
        }
        catch (error) {
            this.selection = emptySelection();
            this.previous = null;
            this.active = null;
            this.applied = { main: null, widget: null, font: null };
            if (error.code === 'ENOENT') {
                try {
                    const id = (await promises_1.default.readFile(node_path_1.default.join(this.directory, 'active'), 'utf8')).trim();
                    this.active = await this.loadActive(id);
                    this.selection = { main: this.active.manifest.ui ? id : null, widget: id, font: this.active.font ? id : null, preferences: {} };
                    await this.resolveSelection();
                }
                catch {
                    this.active = null;
                    this.selection = emptySelection();
                }
            }
        }
    }
    scopes(m) { return [...(m.ui ? ['메인 UI'] : []), '작은 창틀', ...(m.assets.font ? ['폰트'] : [])]; }
    snapshot() { return { active: this.active ? { id: this.active.id, title: this.active.manifest.title } : null, revision: this.revision }; }
    local() { return { installed: this.entries, builtins: builtin_themes_1.builtinThemes, active: this.snapshot().active, selection: this.selection, canUndo: !!this.previous, user: this.user, ...this.connection.status(), guideSeen: this.guideSeen }; }
    async acknowledgeGuide() { await promises_1.default.writeFile(node_path_1.default.join(this.directory, 'guide-version'), '2'); this.guideSeen = true; return this.local(); }
    activeSnapshot() { return { ...(this.active || {}), ...this.snapshot(), applied: this.applied, selection: this.selection }; }
    checkSelection(value) { if (!value || typeof value !== 'object')
        throw themeError('테마 설정을 확인해 주세요.'); const result = emptySelection(); for (const key of ['main', 'widget', 'font']) {
        const id = value[key];
        if (id !== null && (typeof id !== 'string' || !this.entries.some(e => e.id === id) && !(0, builtin_themes_1.builtinTheme)(id)))
            throw themeError('설치한 테마를 다시 선택해 주세요.');
        result[key] = id;
    } for (const [id, p] of Object.entries(value.preferences || {})) {
        if ((!/^[a-f0-9]{64}$/.test(id) && !(0, builtin_themes_1.builtinTheme)(id)) || !p || typeof p.reduced !== 'boolean' || (p.accent !== null && !/^#[0-9a-f]{6}$/i.test(p.accent)))
            throw themeError('테마 개인 설정을 확인해 주세요.');
        result.preferences[id] = { accent: p.accent, reduced: p.reduced };
    } result.overrides = {}; for (const key of ['main', 'widget']) {
        const p = value.overrides?.[key];
        if (p) {
            if (typeof p.reduced !== 'boolean' || (p.accent !== null && !/^#[0-9a-f]{6}$/i.test(p.accent)))
                throw themeError('개인 설정을 확인해 주세요.');
            result.overrides[key] = { accent: p.accent, reduced: p.reduced };
        }
    } return result; }
    async assetsFor(selection) { const values = new Map(); for (const id of [selection.main, selection.widget, selection.font])
        if (id && !values.has(id))
            values.set(id, await this.loadActive(id)); if (selection.main && !values.get(selection.main).manifest.ui)
        throw themeError('메인 화면을 지원하지 않는 테마예요.'); if (selection.font && !values.get(selection.font).font)
        throw themeError('글꼴이 없는 테마예요.'); return { main: values.get(selection.main) || null, widget: values.get(selection.widget) || null, font: values.get(selection.font) || null }; }
    async resolveSelection() { this.applied = await this.assetsFor(this.selection); this.active = this.applied.widget || this.applied.main || this.applied.font; }
    async commitSelection(next, previous) { const assets = await this.assetsFor(next); const tmp = node_path_1.default.join(this.directory, 'selection.tmp'); await promises_1.default.writeFile(tmp, JSON.stringify({ current: next, previous })); await promises_1.default.rename(tmp, node_path_1.default.join(this.directory, 'selection.json')); this.selection = next; this.previous = previous; this.applied = assets; this.active = assets.widget || assets.main || assets.font; this.revision++; this.changed(); return this.local(); }
    async preview(id, remote = false) { if (remote) {
        if (!/^(sample|[a-f0-9]{32})$/.test(id))
            throw themeError('테마를 다시 선택해 주세요.');
        try {
            return await this.request('/v1/themes/' + id + '/preview');
        }
        catch (error) {
            const digest = this.catalogDigests.get(id);
            if (digest && this.entries.some(e => e.id === digest)) {
                const value = await this.loadActive(digest);
                return { ...value, hasFont: !!value.font, font: null };
            }
            throw error;
        }
    } const value = await this.loadActive(id); return { ...value, hasFont: !!value.font, font: null }; }
    async apply(id, options) { if (this.pending)
        throw themeError('다른 테마를 처리 중이에요.'); this.pending = true; try {
        await this.loadActive(id);
        if (!options || !['main', 'widget', 'font'].some(k => options[k] === true) || ['main', 'widget', 'font'].some(k => typeof options[k] !== 'boolean') || typeof options.reduced !== 'boolean' || (options.accent !== null && !/^#[0-9a-f]{6}$/i.test(options.accent)))
            throw themeError('적용할 곳과 개인 설정을 확인해 주세요.');
        const next = structuredClone(this.selection);
        for (const key of ['main', 'widget', 'font'])
            if (options[key])
                next[key] = id;
        next.preferences[id] = { accent: options.accent, reduced: options.reduced };
        next.overrides ||= {};
        for (const key of ['main', 'widget'])
            if (options[key])
                next.overrides[key] = { ...next.preferences[id] };
        return await this.commitSelection(next, this.selection);
    }
    finally {
        this.pending = false;
    } }
    async undo() { if (this.pending)
        throw themeError('다른 테마를 처리 중이에요.'); if (!this.previous)
        throw themeError('되돌릴 모습이 없어요.'); this.pending = true; try {
        return await this.commitSelection(this.previous, this.selection);
    }
    finally {
        this.pending = false;
    } }
    async readLimited(file) { const handle = await promises_1.default.open(file, 'r'); try {
        const stat = await handle.stat();
        if (!stat.isFile() || stat.size > LIMIT)
            throw themeError('5MB 이하 테마 파일을 선택해 주세요.');
        const bytes = Buffer.alloc(stat.size + 1);
        const { bytesRead } = await handle.read(bytes, 0, bytes.length, 0);
        if (bytesRead !== stat.size)
            throw themeError('파일이 바뀌었어요. 다시 선택해 주세요.');
        return bytes.subarray(0, bytesRead);
    }
    finally {
        await handle.close();
    } }
    async validate(bytes) { return new Promise((resolve, reject) => { const worker = new node_worker_threads_1.Worker(node_path_1.default.join(__dirname, 'theme-validator.cjs'), { workerData: bytes, resourceLimits: { maxOldGenerationSizeMb: 48 } }); const timer = setTimeout(() => { void worker.terminate(); reject(themeError('테마 검사 시간이 초과됐어요.')); }, 5000); worker.once('message', r => { clearTimeout(timer); void worker.terminate(); if (r.error)
        return reject(themeError(r.error)); const m = r.manifest; const current = this.version.split('.').map(Number), min = m.compatibility.minAppVersion.split('.').map(Number); let compatible = true; for (let i = 0; i < 3; i++) {
        if (current[i] === min[i])
            continue;
        compatible = current[i] > min[i];
        break;
    } if (!compatible || !m.compatibility.supportedOS.includes(process.platform))
        return reject(themeError('이 앱 버전 또는 OS에서 지원하지 않는 테마예요.')); resolve({ ...r, png: Buffer.from(r.png), font: r.font ? Buffer.from(r.font) : null }); }); worker.once('error', () => { clearTimeout(timer); reject(themeError('테마를 검사할 수 없어요.')); }); }); }
    async request(route, options = {}, binary = false) {
        try {
            const response = await this.connection.request(route, { ...options, headers: { ...(this.token ? { Authorization: 'Bearer ' + this.token } : {}), ...options.headers } });
            if (response.status === 401) {
                this.token = '';
                this.user = null;
            }
            if (!response.ok) {
                const data = await response.json();
                throw themeError(data.error || '테마 요청에 실패했어요.');
            }
            if (!binary)
                return response.json();
            const chunks = [];
            let size = 0;
            for await (const part of response.body) {
                size += part.length;
                if (size > LIMIT)
                    throw themeError('테마 파일이 너무 커요.');
                chunks.push(part);
            }
            const bytes = Buffer.concat(chunks);
            const digest = (0, node_crypto_1.createHash)('sha256').update(bytes).digest('hex');
            if (response.headers.get('X-Content-SHA256') !== digest)
                throw themeError('다운로드가 손상됐어요. 다시 받아 주세요.');
            return bytes;
        }
        catch (e) {
            if (e instanceof Error && ['TimeoutError', 'TypeError'].includes(e.name))
                throw themeError('테마 서버에 연결할 수 없어요. 설치한 테마는 계속 사용할 수 있어요.');
            throw e;
        }
    }
    async browse(page) { const [policy, catalog, me] = await Promise.all([this.request('/v1/policy'), this.request('/v1/themes?page=' + Math.max(1, Math.floor(page) || 1)), this.request('/v1/auth/me')]); for (const item of catalog.themes || [])
        if (/^[a-f0-9]{64}$/.test(item.digest))
            this.catalogDigests.set(item.id, item.digest); this.user = me.user; if (!this.user)
        this.token = ''; return { ...this.local(), policy, ...catalog }; }
    async auth(mode, id, password) { if (!['login', 'register'].includes(mode) || typeof id !== 'string' || typeof password !== 'string' || id.length > 32 || password.length > 128)
        throw themeError('아이디와 비밀번호를 확인해 주세요.'); const r = await this.request('/v1/auth/' + mode, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, password }) }); this.token = r.token; this.user = r.user; return this.local(); }
    async logout() { try {
        await this.request('/v1/auth/logout', { method: 'POST' });
    }
    finally {
        this.token = '';
        this.user = null;
    } return this.local(); }
    async upload(file) { if (!this.token)
        throw themeError('로그인 후 테마를 올릴 수 있어요.'); const bytes = await this.readLimited(file); await this.validate(bytes); return this.request('/v1/themes', { method: 'POST', headers: { 'Content-Type': 'application/zip' }, body: bytes }); }
    createdBytes(encoded) { if (typeof encoded !== 'string' || encoded.length > Math.ceil(LIMIT / 3) * 4 || !encoded.length || encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded))
        throw themeError('만든 테마 파일을 확인해 주세요.'); const bytes = Buffer.from(encoded, 'base64'); if (bytes.length > LIMIT)
        throw themeError('테마가 5MB를 넘어요.'); return bytes; }
    async uploadCreated(encoded, rights) { if (!this.token || rights !== true)
        throw themeError('로그인과 공유 권한을 확인해 주세요.'); const bytes = this.createdBytes(encoded); await this.validate(bytes); return this.request('/v1/themes', { method: 'POST', headers: { 'Content-Type': 'application/zip' }, body: bytes }); }
    async installCreated(encoded) { return this.install(this.createdBytes(encoded)); }
    async download(id) { if (!this.token)
        throw themeError('로그인 후 테마를 받을 수 있어요.'); if (!/^(sample|[a-f0-9]{32})$/.test(id))
        throw themeError('테마를 다시 선택해 주세요.'); return this.install(await this.request('/v1/themes/' + id + '/download', {}, true)); }
    async import(file) { return this.install(await this.readLimited(file)); }
    async install(bytes) { if (this.pending)
        throw themeError('다른 테마를 처리 중이에요.'); this.pending = true; try {
        const v = await this.validate(bytes), entry = { id: v.digest, title: v.manifest.title, version: v.manifest.version, scopes: this.scopes(v.manifest) };
        if (!this.entries.some(e => e.id === v.digest)) {
            if (this.entries.length >= 50)
                throw themeError('설치한 테마를 삭제한 후 다시 시도해 주세요.');
            const tmp = node_path_1.default.join(this.directory, (0, node_crypto_1.randomUUID)() + '.tmp');
            try {
                await promises_1.default.writeFile(tmp, bytes, { flag: 'wx' });
                await promises_1.default.rename(tmp, node_path_1.default.join(this.directory, v.digest + '.silltheme'));
            }
            finally {
                await promises_1.default.rm(tmp, { force: true });
            }
            this.entries.push(entry);
        }
        return this.local();
    }
    finally {
        this.pending = false;
    } }
    async loadActive(id) { const builtin = (0, builtin_themes_1.builtinTheme)(id); if (builtin)
        return structuredClone(builtin); if (!/^[a-f0-9]{64}$/.test(id) || !this.entries.some(e => e.id === id))
        throw themeError('테마를 찾을 수 없어요.'); const v = await this.validate(await this.readLimited(node_path_1.default.join(this.directory, id + '.silltheme'))); if (v.digest !== id)
        throw themeError('설치한 테마가 손상됐어요.'); return { id, manifest: v.manifest, atlas: 'data:image/png;base64,' + v.png.toString('base64'), font: v.font ? v.font.toString('base64') : null }; }
    async activate(id) { if (this.pending)
        throw themeError('다른 테마를 처리 중이에요.'); this.pending = true; try {
        const value = id ? await this.loadActive(id) : null;
        return await this.commitSelection({ main: value?.manifest.ui ? id : null, widget: id, font: value?.font ? id : null, preferences: this.selection.preferences }, this.selection);
    }
    finally {
        this.pending = false;
    } }
    async remove(id) { if (this.pending)
        throw themeError('다른 테마를 처리 중이에요.'); if (!/^[a-f0-9]{64}$/.test(id))
        throw themeError('테마를 다시 선택해 주세요.'); this.pending = true; try {
        const next = structuredClone(this.selection);
        for (const key of ['main', 'widget', 'font'])
            if (next[key] === id)
                next[key] = null;
        delete next.preferences[id];
        await this.commitSelection(next, null);
        await promises_1.default.rm(node_path_1.default.join(this.directory, id + '.silltheme'), { force: true });
        this.entries = this.entries.filter(e => e.id !== id);
        return this.local();
    }
    finally {
        this.pending = false;
    } }
}
exports.Themes = Themes;
