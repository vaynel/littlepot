"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtinTheme = exports.builtinThemes = void 0;
const font_catalog_1 = require("./font-catalog");
// Trusted, bundled artwork. These identifiers are never accepted as package paths.
exports.builtinThemes = [
    ['default', '기본 창틀', '#f7f6f0', '#ffffff', '#edf0e4', '#355b45', '#dce7da'],
    ['flowers', '꽃이 피는 오후', '#fff7f3', '#fffcf9', '#f5e6df', '#914e66', '#f5dce4'],
    ['files', '차곡차곡 파일함', '#f3f6fb', '#ffffff', '#e6edf6', '#345d89', '#d6e6f5'],
    ['runner', '오늘도 한 걸음', '#f7f8f0', '#fffffa', '#eaf0df', '#4c6937', '#dceac5'],
    ['night', '달빛 창가', '#eef0f8', '#fafaff', '#e1e4f0', '#585485', '#272e50'],
    ['fireflies', '반딧불 정원', '#f3f7f4', '#ffffff', '#e5eee7', '#396453', '#dcebe4'],
].map(([kind, title, background, panel, sidebar, accent, sky]) => ({
    id: 'builtin:' + kind, title, version: '1.0.0', creator: 'Little Windowsill', builtin: kind, animated: ['runner', 'fireflies'].includes(kind),
    scopes: ['메인 UI', '작은 창틀', '폰트'],
    manifest: { title, version: '1.0.0', creatorLabel: 'Little Windowsill', licenseId: 'Bundled artwork; fonts: SIL OFL 1.1',
        compatibility: { minAppVersion: kind === 'fireflies' ? '0.6.27' : '0.6.3', supportedOS: ['win32', 'darwin', 'linux'] }, assets: { font: { family: font_catalog_1.bundledFonts.find(f => f.id === (kind === 'fireflies' ? 'default' : kind)).family } },
        palette: { surface: sky, surfaceAlt: sidebar },
        ui: { background, panel, sidebar, accent, text: '#293d3a', muted: '#687775', border: '#d8ded9', accentText: '#ffffff' },
        motion: { preset: kind === 'runner' ? 'run' : kind === 'fireflies' ? 'float' : 'none' } }, atlas: null, font: 'bundled:' + (kind === 'fireflies' ? 'default' : kind), hasFont: true,
}));
const builtinTheme = (id) => exports.builtinThemes.find(theme => theme.id === id);
exports.builtinTheme = builtinTheme;
