"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeConnection = void 0;
exports.themeRoutes = themeRoutes;
exports.requestRoute = requestRoute;
const node_http_1 = __importDefault(require("node:http"));
const node_https_1 = __importDefault(require("node:https"));
const native_1 = require("./native");
const failure = (message) => new native_1.AppError('THEME', message);
const NETWORK = new Set(['ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENETUNREACH', 'EPIPE']);
function themeRoutes(override = process.env.WINDOWSILL_THEME_SERVER) {
    if (override) {
        const u = new URL(override);
        if (u.username || u.password || u.search || u.hash || u.pathname !== '/' || !(u.protocol === 'https:' || (u.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(u.hostname))))
            throw failure('테마 서버 주소를 확인해 주세요.');
        return [{ url: u.origin, label: '지정한 서버' }];
    }
    return [{ url: 'https://littlepot.log2u.me:18472', label: '도메인 HTTPS' },
        { url: 'https://littlepot.log2u.me:18472', address: '192.168.35.96', label: '내부망 HTTPS' },
        { url: 'http://127.0.0.1:18880', label: '개발 SSH 터널' }];
}
// HTTPS retains the public hostname for SNI and certificate verification, even on the LAN route.
function requestRoute(route, path, options = {}, timeout = 15000, limit = 5 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, route.url);
        if (url.origin !== new URL(route.url).origin)
            return reject(failure('허용되지 않은 서버 경로예요.'));
        const headers = Object.fromEntries(new Headers(options.headers).entries());
        const body = options.body;
        if (body != null)
            headers['content-length'] = String(Buffer.byteLength(body));
        let settled = false;
        const finish = (err, response) => { if (settled)
            return; settled = true; clearTimeout(timer); err ? reject(err) : resolve(response); };
        const req = (url.protocol === 'https:' ? node_https_1.default : node_http_1.default).request(url, { method: options.method || 'GET', headers, agent: false,
            ...(route.address ? { servername: url.hostname, lookup: ((_name, _options, callback) => { if (_options?.all)
                    callback(null, [{ address: route.address, family: 4 }]);
                else
                    callback(null, route.address, 4); }) } : {}) }, res => {
            const chunks = [];
            let size = 0;
            res.on('data', part => { size += part.length; if (size > limit) {
                const err = failure('서버 응답 크기가 너무 커요.');
                finish(err);
                req.destroy();
                res.destroy();
            }
            else
                chunks.push(part); });
            res.on('error', err => finish(err));
            res.on('aborted', () => finish(Object.assign(Error('응답이 중단됐어요.'), { code: 'ECONNRESET' })));
            res.on('end', () => { const h = new Headers(); for (const [k, v] of Object.entries(res.headers))
                if (v != null)
                    h.set(k, Array.isArray(v) ? v.join(', ') : v); const status = res.statusCode || 500; finish(undefined, new Response([204, 205, 304].includes(status) ? null : Buffer.concat(chunks), { status, headers: h })); });
        });
        const timer = setTimeout(() => req.destroy(Object.assign(Error('연결 시간이 초과됐어요.'), { code: 'ETIMEDOUT' })), timeout);
        req.on('error', err => finish(err));
        if (body != null)
            req.write(body);
        req.end();
    });
}
class ThemeConnection {
    routes;
    send;
    now;
    selected = null;
    until = 0;
    pending = null;
    constructor(routes = themeRoutes(), send = requestRoute, now = Date.now) {
        this.routes = routes;
        this.send = send;
        this.now = now;
    }
    status() { return { endpoint: this.selected?.url || this.routes[0].url, connection: this.selected?.label || '연결 전', fallback: !!this.selected && this.selected !== this.routes[0] }; }
    async choose() {
        for (const route of this.routes) {
            let r;
            try {
                r = await this.send(route, '/healthz', {}, 3500, 16384);
            }
            catch (e) {
                if (NETWORK.has(e.code))
                    continue;
                throw failure('서버의 안전한 연결을 확인할 수 없어요. 인증서와 서버 설정을 확인해 주세요.');
            }
            // An actual HTTP denial, wrong service, or TLS error must not become an authentication bypass.
            if (!r.ok)
                throw failure('테마 서버가 응답했지만 사용할 수 없어요. 잠시 후 다시 시도해 주세요.');
            let health;
            try {
                health = await r.json();
            }
            catch {
                throw failure('테마 서버 응답을 확인해 주세요.');
            }
            if (health.status !== 'ok' || health.appThemeInstall !== true || health.db !== 'ready')
                throw failure('올바른 테마 서버인지 확인할 수 없어요.');
            this.selected = route;
            this.until = this.now() + 60000;
            return route;
        }
        this.selected = null;
        throw failure('테마 서버에 연결할 수 없어요. 도메인·내부망 또는 개발 터널을 확인해 주세요. 설치한 테마는 계속 사용할 수 있어요.');
    }
    async route() { if (this.selected && this.now() < this.until)
        return this.selected; if (!this.pending)
        this.pending = this.choose().finally(() => { this.pending = null; }); return this.pending; }
    async request(path, options = {}) {
        const route = await this.route();
        try {
            return await this.send(route, path, options, 15000);
        }
        catch (e) {
            this.until = 0;
            if (NETWORK.has(e.code))
                throw failure('서버 연결이 끊겼어요. 요청을 자동으로 다시 보내지 않았어요. 결과를 확인한 뒤 다시 시도해 주세요.');
            throw failure('서버 응답을 안전하게 읽지 못했어요. 연결 설정을 확인해 주세요.');
        }
    }
}
exports.ThemeConnection = ThemeConnection;
