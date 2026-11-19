"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languages = void 0;
exports.normalizeLocale = normalizeLocale;
exports.setLocale = setLocale;
exports.locale = locale;
exports.language = language;
exports.t = t;
exports.l = l;
const locale_catalog_1 = require("./locale-catalog");
exports.languages = ['ko', 'en', 'ja', 'zh-CN'];
let current = 'ko';
function normalizeLocale(value) {
    if (typeof value !== 'string')
        return 'ko';
    const tag = value.toLowerCase().replace(/_/g, '-');
    if (tag === 'en' || tag.startsWith('en-'))
        return 'en';
    if (tag === 'ja' || tag.startsWith('ja-'))
        return 'ja';
    if (tag === 'zh' || tag === 'zh-cn' || tag === 'zh-sg' || tag.startsWith('zh-hans'))
        return 'zh-CN';
    return 'ko';
}
function setLocale(value) { current = normalizeLocale(value); return current; }
function locale() { return current === 'ko' ? 'ko-KR' : current === 'en' ? 'en-US' : current === 'ja' ? 'ja-JP' : 'zh-CN'; }
function language() { return current; }
// Only source-owned literals are passed here. Runtime names, paths and HTML are never scanned.
function t(source) {
    if (current === 'ko')
        return source;
    return source.replace(/[^<>"'\n]+/g, part => {
        const key = part.trim(), entry = Object.hasOwn(locale_catalog_1.catalog, key) ? locale_catalog_1.catalog[key] : undefined;
        if (!entry)
            return part;
        return part.slice(0, part.indexOf(key)) + entry[current] + part.slice(part.indexOf(key) + key.length);
    });
}
function l(parts, ...values) {
    const source = parts.reduce((s, p, i) => s + (i ? `{${i - 1}}` : '') + p, '');
    return t(source).replace(/\{(\d+)\}/g, (original, index) => Number(index) < values.length ? String(values[Number(index)] ?? '') : original);
}
