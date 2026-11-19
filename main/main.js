"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ui_labels_1 = require("./ui-labels");
const record_cleanup_1 = require("./record-cleanup");
const diagnostic_export_1 = require("./diagnostic-export");
const diagnostics_1 = require("./diagnostics");
const tutorial_1 = require("./tutorial");
const font_catalog_1 = require("./font-catalog");
const import_planner_1 = require("./import-planner");
const aftercare_1 = require("./aftercare");
const organizer_1 = require("./organizer");
const root_order_1 = require("./root-order");
const locale_1 = require("./locale");
const desktop = require("./desktop.cjs");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const core_1 = require("./core");
const native_1 = require("./native");
const node_crypto_1 = require("node:crypto");
const versions_1 = require("./versions");
const intelligence_1 = require("./intelligence");
const fonts_1 = require("./fonts");
const themes_1 = require("./themes");
let themes;
let core;
let fonts;
let versions;
let aftercare;
let organizer;
let intelligence;
let closing = false;
let uiReady = false;
let handleGarden;
let pendingReview = null;
let widgetBounds;
let boundsTimer;
let trayReady = false;
const rootPreviews = new Map();
const recommendations = new Map();
const dataDir = process.env.WINDOWSILL_DATA_DIR;
const appVersion = process.env.WINDOWSILL_VERSION;
const diagnostics = new diagnostics_1.Diagnostics(dataDir, appVersion);
const diagnosticExports = new diagnostic_export_1.DiagnosticExport(diagnostics, dataDir);
let diagnosticSaving = false;

diagnostics.record('app.start');
process.on('uncaughtExceptionMonitor', error => diagnostics.error('main.uncaught', error));
process.on('unhandledRejection', error => {
    diagnostics.error('main.rejection', error);
    desktop.exit(1);
});

const t = locale_1.t;
const l = locale_1.l;
const widgetCount = () => Math.max(1, Math.min(3, core.setting('visiblePlants', 3) || 3));
const widgetDefault = (count = widgetCount()) => ({ width: 54 + 42 * count, height: 100 });
const widgetMinWidth = () => 62 + 26 * widgetCount();

function showManager(route = 'garden') {
    if (uiReady && !closing)
        desktop.notify('manager', { route, title: t('작은 창틀') });
}

function saveWidgetBounds(bounds, count = widgetCount()) {
    if (!bounds || versions?.deleting)
        return;
    core.setSetting('widgetBounds', bounds);
    core.setSetting('widgetBoundsCount', count);
    core.setSetting('widgetSizes', { ...core.setting('widgetSizes', {}), [count]: { width: bounds.width, height: bounds.height } });
}

function showWidget({ reset = false, show = true, focus = false, previousCount } = {}) {
    if (!uiReady || closing)
        return;
    const count = widgetCount();
    const current = widgetBounds ?? core.setting('widgetBounds', {});
    const previous = previousCount ?? core.setting('widgetBoundsCount', count);
    let bounds = current;
    if (reset || previous !== count) {
        const size = reset ? widgetDefault() : core.setting('widgetSizes', {})[count] ?? {
            width: Number.isFinite(current.width) ? Math.round(current.width * widgetDefault(count).width / widgetDefault(previous).width) : widgetDefault(count).width,
            height: current.height ?? widgetDefault(count).height
        };
        bounds = { ...current, ...size };
    }
    desktop.notify('widget', {
        title: t('작은 창틀 · 정원'), bounds: { ...widgetDefault(), ...bounds },
        minWidth: widgetMinWidth(), show, focus, adjust: reset || previous !== count
    });
}

function refreshTrayLanguage() {
    desktop.notify('tray', {
        title: t('작은 창틀'), manager: t('작은 창틀 열기'), widget: t('창틀 정리 모드'),
        hide: t('창틀 숨기기'), quit: t('종료')
    });
}

function widgetMenu() {
    desktop.notify('widget-menu', {
        manager: t('정원 관리 · 파일 정리'), help: t('사용 안내'),
        hint: t('크기: 왼쪽 위 모서리를 드래그'), reset: l`작은 기본 크기로 (${widgetDefault().width} × 100)`,
        view: t('클릭 통과로 감상하기'), hide: t('창틀 숨기기'), quit: t('종료')
    });
}

async function chooseOpen(sender, options) {
    const path = await desktop.request('open-dialog', { sender, ...options });
    return { canceled: !path, filePaths: path ? [path] : [] };
}

async function chooseSave(sender, options) {
    const filePath = await desktop.request('save-dialog', { sender, ...options });
    return { canceled: !filePath, filePath };
}

async function openPath(path) {
    try {
        await desktop.request('open-path', path);
        return false;
    } catch {
        return true;
    }
}

function state() { return { ...core.state(), tutorial: core.setting('tutorial', null), organize: organizer?.summary(), aftercare: aftercare?.snapshot(), themes: themes?.snapshot(), managed: versions?.summary(), guide: core.setting('guide', { step: 0, status: core.setting('onboarded', false) ? 'completed' : 'not_started', version: 1 }), native: true, platform: process.platform, canClickThrough: trayReady, version: appVersion }; }
async function prepare(files, plant, mode = 'copy', selected, once = false, previous, layout) {
    const result = await (0, import_planner_1.prepareImport)(core, versions, intelligence, files, plant, mode, selected, once, previous, layout);
    recommendations.set(result.id, result);
    return result;
}
async function quit(hostClosed = false) {
    if (closing)
        return;
    if (!hostClosed && core?.busy) {
        showManager();
        return;
    }
    closing = true;
    diagnostics.record('app.quit');
    clearTimeout(boundsTimer);
    if (core)
        saveWidgetBounds(widgetBounds);
    try {
        await organizer?.close();
        await aftercare?.close();
        await versions?.close();
        core?.close();
    } finally {
        if (hostClosed) process.exit(0);
        else desktop.exit();
    }
}

async function hostEvent(event, value) {
    if (event === 'host-closed') return quit(true);
    if (!uiReady || closing) return;
    switch (event) {
        case 'activate': desktop.notify('click-through', false); showManager(); break;
        case 'manager': showManager(); break;
        case 'files': showManager('files'); break;
        case 'help': showManager('help'); break;
        case 'widget': showWidget({ focus: true }); break;
        case 'reset': showWidget({ reset: true }); break;
        case 'view': desktop.notify('click-through', true); break;
        case 'hide': desktop.notify('hide-widget'); break;
        case 'quit': await quit(); break;
        case 'tray-ready': trayReady = Boolean(value); core.onChange(); break;
        case 'manager-closed': diagnosticExports.forget('manager'); break;
        case 'widget-bounds':
            widgetBounds = value;
            clearTimeout(boundsTimer);
            boundsTimer = setTimeout(() => saveWidgetBounds(widgetBounds), 250);
            break;
    }
}

desktop.listen((sender, method, ...args) => {
    if (!uiReady || closing || !['manager', 'widget'].includes(sender))
        return { ok: false, error: '허용되지 않은 요청이에요.' };
    return handleGarden(sender, method, ...args);
}, hostEvent);

async function initialize() {
    core = new core_1.GardenCore(dataDir);
    core.onDiagnostic = error => diagnostics.error('files.failure', error);
    (0, locale_1.setLocale)(core.setting('language', 'ko'));
    fonts = new fonts_1.LocalFonts(core);
    themes = new themes_1.Themes(node_path_1.default.join(dataDir, 'theme-store'), appVersion, () => core.onChange?.());
    await themes.init();
    versions = new versions_1.VersionStore(node_path_1.default.join(dataDir, 'version-store'));
    versions.backgroundCoreDir = dataDir;
    versions.onBackgroundRecordsDeleted = () => { core.plans.clear(); recommendations.clear(); pendingReview = null; };
    versions.onRecordsDeleted = target => { (0, record_cleanup_1.cleanCoreRecords)(core, target); recommendations.clear(); pendingReview = null; };
    versions.onDiagnostic = error => diagnostics.error('versions.failure', error);
    intelligence = new intelligence_1.Intelligence(versions);
    await versions.init();
    if (closing)
        return;
    aftercare = new aftercare_1.Aftercare(core, versions);
    versions.beforeRecordDeletion = () => aftercare.idle();
    organizer = new organizer_1.Organizer(core, versions);
    versions.transferActive = () => organizer.transferring || !!core.progress;
    aftercare.canNotify = batch => !core.db.prepare("SELECT id FROM organize_jobs WHERE id=? AND state IN ('executing','paused')").get(batch);
    core.beforeOperation = async (op) => {
        if (organizer.validateOperation(op))
            return;
        const root = versions.rootForPlant(op.plant);
        if (!root?.active || !(0, versions_1.inside)(root.path, op.destination))
            throw new native_1.AppError('ROOT', '관리 범위가 바뀌었어요. 폴더 관리를 다시 확인해 주세요.');
    };
    core.afterOperation = async (op, kind) => {
        organizer.recordLocation(op, kind);
        aftercare.enqueue(op, kind, organizer.itemFor(op)?.job || op.batch);
        if (organizer.itemFor(op)) {
            try {
                organizer.learnLocation(op, kind, intelligence);
            }
            catch { /* Learning must not retry an already completed transfer. */ }
            return;
        }
        if (kind.startsWith('undo'))
            intelligence.unlearn(op.id);
        else {
            const plan = recommendations.get(op.batch), root = versions.rootForPlant(op.plant);
            if (root && plan && !plan.once) {
                try {
                    intelligence.learn(op.id, root.id, op.source, op.destination, .7, JSON.parse(op.identity).hash);
                }
                catch { /* Learning failure never repeats the file operation. */ }
            }
        }
    };
    try {
        await core.recover();
    }
    catch { /* Remains blocked with the journal preserved for retry. */ }
    if (closing)
        return;
    core.visit();
    let notifyTimer;
    core.onChange = () => {
        if (notifyTimer) return;
        notifyTimer = setTimeout(() => {
            notifyTimer = undefined;
            if (!closing) desktop.notify('changed');
        }, 120);
    };
    versions.onChange = core.onChange;
    organizer.onChange = core.onChange;
    aftercare.onChange = core.onChange;
    aftercare.onComplete = result => {
        if (result.failed)
            diagnostics.record('aftercare.failure', { count: result.failed });
        desktop.notify('notification', {
            title: t(result.failed ? '파일 보관 확인 필요' : '파일 관리 완료'),
            body: l`보관 완료 ${result.completed}개 · 확인 필요 ${result.failed + result.changed}개`,
            route: 'files'
        });
    };
    aftercare.start();
    versions.start();
    handleGarden = async (sender, method, ...args) => {
        const request = (0, node_crypto_1.randomUUID)(), started = Date.now();
        const tracked = !['state', 'diagnostics', 'takeReview'].includes(method) && !(method === 'themes' && ['active', 'local', 'preview'].includes(args[0])) && !(method === 'manage' && ['organize-list', 'organize-page', 'organize-policy', 'organize-folders', 'dashboard', 'files', 'browseFolders', 'timeline', 'analyze', 'folders', 'storage', 'guide'].includes(args[0]));
        if (tracked)
            diagnostics.record('ipc.start', { method, command: args[0], request });
        try {
            if ((versions.deleting || versions.recordRecoveryRequired) && !(method === 'manage' && args[0] === 'retry' && !versions.deleting) && !['state', 'takeReview', 'diagnostics', 'themes', 'widget', 'manager', 'view', 'widgetMenu', 'quit', 'openFolder'].includes(method) && !(method === 'font' && args[0] === 'read') && !(method === 'manage' && ['organize-list', 'organize-page', 'organize-policy', 'organize-folders', 'dashboard', 'files', 'attention-files', 'browseFolders', 'timeline', 'storage', 'analyze', 'folders', 'openFileFolder'].includes(args[0])))
                throw new native_1.AppError('BUSY', '관리 기록을 삭제하고 있어요. 잠시 기다려 주세요.');
            let value;
            switch (method) {
                case 'state':
                    value = state();
                    break;
                case 'diagnostics': {
                    const command = args[0];
                    if (command === 'renderer-error' || command === 'renderer-rejection') {
                        const payload = args[1];
                        diagnostics.error(command === 'renderer-error' ? 'renderer.error' : 'renderer.rejection', { name: typeof payload?.kind === 'string' ? payload.kind : 'Error', stack: typeof payload?.stack === 'string' ? payload.stack.slice(0, 12000) : '' });
                        value = true;
                        break;
                    }
                    if (sender !== 'manager')
                        throw new native_1.AppError('METHOD', (0, locale_1.t)('관리 화면에서 이용해 주세요.'));
                    if (command === 'preview') {
                        value = diagnosticExports.preview(sender);
                        break;
                    }
                    if (command !== 'export')
                        throw new native_1.AppError('METHOD', (0, locale_1.t)('알 수 없는 요청이에요.'));
                    if (diagnosticSaving)
                        throw new native_1.AppError('BUSY', (0, locale_1.t)('진단 파일 저장 창을 먼저 닫아 주세요.'));
                    const preview = diagnosticExports.reviewed(sender, args[1]);
                    diagnosticSaving = true;
                    try {
                        const target = await chooseSave(sender, { title: (0, locale_1.t)('진단 파일 저장'), defaultPath: 'windowsill-diagnostics-' + preview.token + '.json', filters: [{ name: 'JSON', extensions: ['json'] }] });
                        if (target.canceled || !target.filePath) {
                            value = { saved: false };
                            break;
                        }
                        value = await diagnosticExports.save(sender, args[1], target.filePath);
                        break;
                    }
                    finally {
                        diagnosticSaving = false;
                    }
                }
                case 'themes': {
                    const command = args[0];
                    if (command === 'active') {
                        value = themes.activeSnapshot();
                        break;
                    }
                    if (sender !== 'manager')
                        throw new native_1.AppError('THEME', '관리 화면에서 이용해 주세요.');
                    if (command === 'local')
                        value = themes.local();
                    else if (command === 'guide-seen')
                        value = await themes.acknowledgeGuide();
                    else if (command === 'browse')
                        value = await themes.browse(Number(args[1]));
                    else if (command === 'login' || command === 'register')
                        value = await themes.auth(command, args[1], args[2]);
                    else if (command === 'logout')
                        value = await themes.logout();
                    else if (command === 'publish-created')
                        value = await themes.uploadCreated(args[1], args[2]);
                    else if (command === 'install-created')
                        value = await themes.installCreated(args[1]);
                    else if (command === 'download')
                        value = await themes.download(args[1]);
                    else if (command === 'preview')
                        value = await themes.preview(args[1], args[2] === true);
                    else if (command === 'apply')
                        value = await themes.apply(args[1], args[2]);
                    else if (command === 'undo')
                        value = await themes.undo();
                    else if (command === 'activate')
                        value = await themes.activate(args[1]);
                    else if (command === 'remove')
                        value = await themes.remove(args[1]);
                    else if (command === 'import' || command === 'upload') {
                        if (command === 'upload' && (args[1] !== true || !themes.local().user))
                            throw new native_1.AppError('THEME', '로그인과 공유 권한 확인이 필요해요.');
                        const picked = await chooseOpen(sender, { title: (0, locale_1.t)(command === 'upload' ? '공유할 테마 선택' : '받은 테마 파일 설치'), filters: [{ name: (0, locale_1.t)('창틀 테마'), extensions: ['silltheme', 'zip'] }], properties: ['openFile'] });
                        value = picked.canceled ? themes.local() : command === 'upload' ? await themes.upload(picked.filePaths[0]) : await themes.import(picked.filePaths[0]);
                    }
                    else
                        throw new native_1.AppError('THEME', '알 수 없는 테마 요청이에요.');
                    break;
                }
                case 'renamePlant':
                    value = core.renamePlant(args[0], args[1]);
                    break;
                case 'bind': {
                    core.assertReady();
                    if (args[0] !== -1)
                        core.plant(args[0]);
                    const result = await chooseOpen(sender, { title: (0, locale_1.t)('화분에 연결할 폴더 선택'), properties: ['openDirectory'] });
                    if (result.canceled) {
                        value = null;
                        break;
                    }
                    const preview = await versions.preview(result.filePaths[0], args[0] === -1 ? null : args[0]);
                    const token = (0, node_crypto_1.randomUUID)();
                    rootPreviews.set(token, { ...preview, plant: args[0] === -1 ? null : args[0], name: args[1], created: Date.now() });
                    value = { ...preview, token, plant: args[0], name: args[1] };
                    break;
                }
                case 'pickFolder':
                case 'pick': {
                    throw new native_1.AppError('PLAN', '내 파일에서 관리 폴더를 선택한 뒤 이 폴더 정리를 눌러 주세요.');
                }
                case 'drop': {
                    value = await prepare(args[0], args[1], 'copy');
                    if (sender === 'widget') {
                        pendingReview = value;
                        showManager('files');
                        core.onChange();
                        value = null;
                    }
                    break;
                }
                case 'takeReview':
                    value = sender === 'manager' ? pendingReview : null;
                    if (value)
                        pendingReview = null;
                    break;
                case 'revise': {
                    const old = recommendations.get(args[0]);
                    if (!old || !core.plans.has(old.id))
                        throw new native_1.AppError('PLAN', '파일을 다시 선택해 주세요.');
                    const folders = args[2];
                    if (!folders || typeof folders !== 'object' || Array.isArray(folders))
                        throw new native_1.AppError('PLAN', '목적지를 확인해 주세요.');
                    value = await prepare(old.rows.map((r) => r.source), old.plant, args[1], folders, !!args[3], old, args[4]);
                    if (old.retryTask) {
                        const revised = value;
                        core.plans.get(revised.id).retryTask = old.retryTask;
                        revised.retryTask = old.retryTask;
                        recommendations.set(revised.id, revised);
                    }
                    core.plans.delete(old.id);
                    recommendations.delete(old.id);
                    break;
                }
                case 'manage': {
                    const [command, a, b, c] = args;
                    switch (command) {
                        case 'organize-folders': {
                            versions.root(String(a));
                            const q = typeof b === 'string' ? b.toLocaleLowerCase() : '';
                            value = versions.browseFolders(String(a)).filter(p => p.toLocaleLowerCase().includes(q)).slice(0, 50);
                            break;
                        }
                        case 'organize-list':
                            value = organizer.summary(a);
                            break;
                        case 'organize-page':
                            value = organizer.page(String(a), b?.after, b?.size, b?.filter, b?.destination);
                            break;
                        case 'organize-policy':
                            value = organizer.policy(String(a), String(b));
                            break;
                        case 'organize-start':
                            value = organizer.start(String(a), String(b?.scope), b?.recursive === true, b?.policy);
                            break;
                        case 'organize-folder-approve':
                            organizer.approveFolder(String(a), String(b?.path), b?.approved, b?.revision);
                            value = true;
                            break;
                        case 'organize-select':
                            organizer.select(String(a), b?.item || null, b?.selected, b?.revision);
                            value = true;
                            break;
                        case 'organize-destination':
                            organizer.destination(String(a), b?.item, b?.destination, b?.revision);
                            value = true;
                            break;
                        case 'organize-approve':
                            organizer.approve(String(a), b?.revision, b?.acceptPartial === true);
                            value = true;
                            break;
                        case 'organize-pause':
                            await organizer.pause(String(a));
                            value = true;
                            break;
                        case 'organize-resume':
                            organizer.resume(String(a));
                            value = true;
                            break;
                        case 'organize-review':
                            organizer.review(String(a));
                            value = true;
                            break;
                        case 'dashboard':
                            value = versions.dashboard();
                            break;
                        case 'storage':
                            value = await versions.storageStatus();
                            break;
                        case 'aftercare-retry':
                            aftercare.retry(a);
                            value = true;
                            break;
                        case 'storage-budget':
                            value = await versions.setStorageBudget(a);
                            break;
                        case 'storage-compact':
                            value = await versions.compactStorage();
                            break;
                        case 'confirmRoot': {
                            const p = rootPreviews.get(a);
                            if (!p || Date.now() - p.created > 600000)
                                throw new native_1.AppError('ROOT', '폴더를 다시 선택해 주세요.');
                            core.assertReady();
                            // Revalidate before changing the legacy binding. No capture begins in preview.
                            const checked = await versions.preview(p.folder, p.plant);
                            if (checked.identity !== p.identity)
                                throw new native_1.AppError('CHANGED', '폴더가 바뀌었어요. 다시 선택해 주세요.');
                            if (!versions.ready || versions.error)
                                throw new native_1.AppError('GIT', versions.error || '버전 저장소를 준비해 주세요.');
                            if (p.plant !== null)
                                core.bind(p.plant, p.folder, p.name);
                            value = await versions.register(p.folder, p.plant, p.identity, checked.count, checked.complete);
                            rootPreviews.delete(a);
                            if (core.setting('guide', {}).status !== 'completed')
                                core.setSetting('guide', { step: 2, status: 'in_progress', version: 1 });
                            break;
                        }
                        case 'rootOrder': {
                            const order = (0, root_order_1.validateRootOrder)(a, versions.roots().map(r => r.id));
                            core.setSetting('managedRootOrder', order);
                            core.onChange();
                            value = order;
                            break;
                        }
                        case 'file-management':
                            value = await versions.fileManagement(String(a), b);
                            break;
                        case 'delete-records': {
                            core.assertReady();
                            if (!versions.ready || versions.error)
                                throw new native_1.AppError('GIT', '저장소를 다시 확인한 뒤 기록을 삭제해 주세요.');
                            if (versions.transferActive())
                                throw new native_1.AppError('BUSY', '진행 중인 작업을 마친 뒤 기록을 삭제해 주세요.');
                            if (core.db.prepare("SELECT id FROM organize_jobs WHERE state IN ('indexing','analyzing','executing') LIMIT 1").get())
                                throw new native_1.AppError('BUSY', '폴더 정리 작업을 마치거나 중단한 뒤 기록을 삭제해 주세요.');
                            void versions.deleteRecords(a, String(b)).catch(() => { });
                            value = { accepted: true };
                            break;
                        }
                        case 'files':
                            value = versions.list(String(a), b === 'unmanaged' ? 'unmanaged' : 'managed');
                            break;
                        case 'attention-files':
                            value = versions.attentionFiles(String(a));
                            break;
                        case 'browseFolders':
                            value = versions.browseFolders(String(a));
                            break;
                        case 'shortcut': {
                            core.assertReady();
                            core.plant(b);
                            const root = versions.root(String(a));
                            await versions.preview(root.path, b);
                            core.bind(b, root.path);
                            versions.assignShortcut(root.id, b);
                            value = true;
                            break;
                        }
                        case 'openFile': {
                            const target = versions.openablePath(String(a));
                            const error = await openPath(target);
                            if (error)
                                throw new native_1.AppError('OPEN', '파일을 열지 못했어요. 연결 프로그램을 확인해 주세요.');
                            versions.recordOpen(String(a));
                            value = true;
                            break;
                        }
                        case 'openFileFolder': {
                            const target = versions.containingFolder(String(a));
                            const error = await openPath(target);
                            if (error)
                                throw new native_1.AppError('OPEN', '폴더를 열지 못했어요. 위치와 권한을 확인해 주세요.');
                            value = true;
                            break;
                        }
                        case 'timeline':
                            value = versions.timeline(String(a));
                            break;
                        case 'compareVersions':
                            value = await versions.compareVersions(String(a), String(b), String(c));
                            break;
                        case 'scan':
                            versions.requestScan(String(a), true);
                            value = true;
                            break;
                        case 'retry':
                            await versions.retry();
                            await core.recover();
                            value = true;
                            break;
                        case 'active':
                            if (typeof b !== 'boolean')
                                throw new native_1.AppError('ROOT', '설정을 확인해 주세요.');
                            await versions.setActive(String(a), b);
                            value = true;
                            break;
                        case 'folders':
                            value = await versions.folders(String(a));
                            break;
                        case 'analyze':
                            value = intelligence.analyze(String(a));
                            break;
                        case 'saveRouting':
                            value = intelligence.routing.save(String(a), b);
                            break;
                        case 'toggleRouting':
                            intelligence.routing.toggle(String(a), String(b), c);
                            value = true;
                            break;
                        case 'testRecommendation': {
                            if (typeof b !== 'string' || !b.trim() || b.length > 200 || /[\\/\x00-\x1f]/.test(b))
                                throw new native_1.AppError('RULE', '경로가 아닌 파일명 하나를 입력해 주세요.');
                            value = await intelligence.recommend(String(a), b.trim());
                            break;
                        }
                        case 'approveRule':
                            value = intelligence.approve(String(a), String(b), String(c));
                            break;
                        case 'exception':
                            intelligence.exception(String(a), !!b);
                            value = true;
                            break;
                        case 'disableRule':
                            intelligence.disable(String(a));
                            value = true;
                            break;
                        case 'resetLearning':
                            intelligence.reset(String(a));
                            value = true;
                            break;
                        case 'tutorial': {
                            (0, tutorial_1.changeTutorial)(core, a, state());
                            value = true;
                            break;
                        }
                        case 'guide': {
                            if (!a || !Number.isInteger(a.step) || a.step < 0 || a.step > 5 || !['not_started', 'in_progress', 'deferred', 'completed'].includes(a.status))
                                throw new native_1.AppError('GUIDE', '안내 진행을 확인해 주세요.');
                            core.setSetting('guide', { step: a.step, status: a.status, version: 1 });
                            core.setSetting('onboarded', true);
                            value = true;
                            break;
                        }
                        case 'restore': {
                            core.assertReady();
                            const version = versions.db.prepare('SELECT v.*,f.path FROM versions v JOIN files f ON f.id=v.file WHERE v.id=?').get(String(a));
                            if (!version)
                                throw new native_1.AppError('VERSION', '버전을 선택해 주세요.');
                            const ext = node_path_1.default.extname(version.path), name = node_path_1.default.basename(version.path, ext);
                            const result = await chooseSave(sender, { title: (0, locale_1.t)('다른 이름으로 저장'), defaultPath: node_path_1.default.join(node_path_1.default.dirname(version.path), `${name}_복원_v${version.seq}${ext}`), buttonLabel: (0, locale_1.t)('저장') });
                            value = result.canceled || !result.filePath ? null : await versions.restore(String(a), result.filePath);
                            break;
                        }
                        default: throw new native_1.AppError('METHOD', '지원하지 않는 관리 요청이에요.');
                    }
                    if (!['organize-policy', 'organize-list', 'organize-page', 'organize-folders', 'files', 'timeline', 'folders', 'browseFolders', 'analyze', 'openFile', 'openFileFolder', 'compareVersions', 'testRecommendation'].includes(command))
                        core.onChange();
                    break;
                }
                case 'widgetMenu':
                    if (sender === 'widget')
                        widgetMenu();
                    value = true;
                    break;
                case 'taskRetry': {
                    const plan = await core.retryPlan(String(args[0]));
                    const root = versions.rootForPlant(plan.plant);
                    if (!root?.active || root.path !== plan.folder)
                        throw new native_1.AppError('ROOT', '이 폴더의 버전관리를 먼저 시작해 주세요.');
                    if (versions.error)
                        throw new native_1.AppError('GIT', versions.error);
                    // Use the already indexed folders; preparation still checks every real path.
                    const folders = versions.browseFolders(root.id);
                    value = { ...plan, rootId: root.id, rows: plan.rows.map(row => ({ ...row, recommendation: { folders: [...new Set([...folders, row.destinationFolder].filter(Boolean))], candidates: [] } })) };
                    recommendations.set(plan.id, value);
                    break;
                }
                case 'execute': {
                    value = await core.execute(args[0]);
                    const delivered = value.rows.filter((r) => r.status === 'completed').length;
                    if (delivered)
                        desktop.notify('notification', { title: t('파일 전달 완료'), body: l`${delivered}개 복사·이동 완료. 버전 보관은 백그라운드에서 계속돼요.` });
                    break;
                }
                case 'undo':
                    value = await core.undo(args[0]);
                    break;
                case 'recover':
                    value = await core.recover();
                    break;
                case 'cancel': {
                    const job = organizer.summary().find((j) => j.state === 'executing');
                    if (job)
                        await organizer.pause(job.id);
                    else
                        core.cancel = true;
                    if (core.progress)
                        core.progress.cancelRequested = true;
                    core.onChange();
                    value = true;
                    break;
                }
                case 'font': {
                    if (args[0] === 'pick') {
                        const picked = await chooseOpen(sender, { title: (0, locale_1.t)('앱에서 사용할 폰트 선택'), properties: ['openFile'], filters: [{ name: (0, locale_1.t)('폰트'), extensions: ['ttf', 'otf', 'woff', 'woff2'] }] });
                        value = picked.canceled ? null : await fonts.stage(picked.filePaths[0]);
                    }
                    else if (args[0] === 'install')
                        value = await fonts.install(args[1]);
                    else if (args[0] === 'read')
                        value = await fonts.read();
                    else if (args[0] === 'reset')
                        value = await fonts.reset();
                    else
                        throw new native_1.AppError('FONT', '알 수 없는 폰트 요청이에요.');
                    break;
                }
                case 'setting': {
                    if (!['theme', 'reducedMotion', 'onboarded', 'visiblePlants', 'searchPageSize', 'language', 'fontChoice', 'uiLabels'].includes(args[0]))
                        throw new native_1.AppError('SETTING', '알 수 없는 설정이에요.');
                    if (args[0] === 'uiLabels') {
                        try {
                            args[1] = (0, ui_labels_1.validateUILabels)(args[1]);
                        }
                        catch {
                            throw new native_1.AppError('SETTING', '문구의 길이와 사용할 수 없는 문자를 확인해 주세요.');
                        }
                    }
                    if (args[0] === 'fontChoice' && !font_catalog_1.fontChoices.includes(args[1]))
                        throw new native_1.AppError('SETTING', '글꼴을 다시 선택해 주세요.');
                    if (args[0] === 'language' && !locale_1.languages.includes(args[1]))
                        throw new native_1.AppError('SETTING', 'Unsupported language');
                    if (args[0] === 'searchPageSize' && ![10, 20, 50, 100].includes(args[1]))
                        throw new native_1.AppError('SETTING', '페이지당 10·20·50·100개 중 선택해 주세요.');
                    if (args[0] === 'visiblePlants' && ![1, 2, 3].includes(args[1]))
                        throw new native_1.AppError('SETTING', '화분은 1~3개까지 표시할 수 있어요.');
                    if (args[0] === 'theme' && !['sage', 'evening', 'cream'].includes(args[1]))
                        throw new native_1.AppError('SETTING', '테마를 선택해 주세요.');
                    if (!['theme', 'visiblePlants', 'searchPageSize', 'language', 'fontChoice', 'uiLabels'].includes(args[0]) && typeof args[1] !== 'boolean')
                        throw new native_1.AppError('SETTING', '설정 값을 확인해 주세요.');
                    const previousCount = widgetCount();
                    if (args[0] === 'visiblePlants') {
                        clearTimeout(boundsTimer);
                        saveWidgetBounds(widgetBounds, previousCount);
                    }
                    core.setSetting(args[0], args[1]);
                    if (args[0] === 'language') {
                        (0, locale_1.setLocale)(args[1]);
                        refreshTrayLanguage();
                        desktop.notify('titles', { manager: t('작은 창틀'), widget: t('작은 창틀 · 정원') });
                    }
                    if (args[0] === 'visiblePlants' && previousCount !== widgetCount())
                        showWidget({ show: false, previousCount });
                    core.onChange();
                    value = state();
                    break;
                }
                case 'openFolder': {
                    const folder = core.plant(args[0]).folder;
                    if (folder) {
                        (0, native_1.safePath)(folder, true);
                        const error = await openPath(folder);
                        if (error)
                            throw new native_1.AppError('OPEN', '폴더를 열지 못했어요.');
                    }
                    value = true;
                    break;
                }
                case 'widget':
                    showWidget({ focus: true });
                    value = true;
                    break;
                case 'manager':
                    showManager(['garden', 'files', 'rules', 'help', 'history', 'settings', 'themes'].includes(args[0]) ? args[0] : 'garden');
                    value = true;
                    break;
                case 'view':
                    if (!trayReady)
                        throw new native_1.AppError('VIEW', '이 환경에서는 조작 버튼이 있는 감상 모드를 사용해 주세요.');
                    desktop.notify('click-through', Boolean(args[0]));
                    value = true;
                    break;
                case 'quit':
                    void quit();
                    value = true;
                    break;
                default: throw new native_1.AppError('METHOD', '알 수 없는 요청이에요.');
            }
            if (tracked)
                diagnostics.record('ipc.done', { method, command: args[0], request, durationMs: Date.now() - started });
            return { ok: true, value };
        }
        catch (error) {
            diagnostics.error('ipc.failure', error, { method, command: args[0], request, durationMs: Date.now() - started });
            return { ok: false, error: (0, core_1.friendly)(error) };
        }
    };
    if (closing) return;
    uiReady = true;
    diagnostics.record('app.ready');
    refreshTrayLanguage();
    showManager();
    showWidget();
}
initialize().catch(async error => {
    diagnostics.error('startup.failure', error);
    uiReady = false;
    let detail = '로컬 기록을 확인할 수 없어 파일 정리를 시작하지 않았어요.';
    try {
        node_fs_1.default.mkdirSync(dataDir, { recursive: true });
        const log = node_path_1.default.join(dataDir, 'startup-error.log');
        node_fs_1.default.writeFileSync(log, JSON.stringify({ time: new Date().toISOString(), version: appVersion, ...(0, diagnostics_1.safeError)(error) }));
        detail += `\n오류 기록: ${log}`;
    }
    catch {
        detail += '\n오류 기록을 저장하지 못했어요. 앱 기록 폴더의 접근 권한을 확인해 주세요.';
    }
    await desktop.request('startup-error', detail).catch(() => {});
    desktop.exit(1);
});
