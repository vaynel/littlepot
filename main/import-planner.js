"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareImport = prepareImport;
const node_path_1 = __importDefault(require("node:path"));
const native_1 = require("./native");
const folder_import_1 = require("./folder-import");
async function prepareImport(core, store, intelligence, inputs, plant, mode = 'copy', selected, once = false, previous, layout) {
    core.assertReady();
    const root = store.rootForPlant(plant);
    if (!root?.active || root.path !== core.plant(plant).folder)
        throw new native_1.AppError('ROOT', '관리 파일·버전에서 이 폴더의 버전관리를 먼저 시작해 주세요.');
    core.busy = true;
    core.cancel = false;
    core.onChange();
    let inventory, folders, details = {}, destinations = {}, chosen = 'recommend', base = root.path;
    try {
        inventory = previous?.inventory || await (0, folder_import_1.collectImport)(inputs, root.path, () => core.cancel);
        if (!inventory.files.length)
            throw new native_1.AppError('EMPTY', '정리할 파일이 없어요. 빈 폴더나 제외 항목만 있는지 확인해 주세요.');
        chosen = inventory.folders ? (layout || previous?.layout || 'structure') : 'recommend';
        if (!['structure', 'recommend'].includes(chosen))
            throw new native_1.AppError('PLAN', '정리 방식을 선택해 주세요.');
        const changed = !!previous?.layout && previous.layout !== chosen;
        const prior = previous?.rootId === root.id ? previous.rows : null;
        folders = previous?.targetFolders || await store.folders(root.id);
        base = chosen === 'structure' ? selected?.__base || previous?.base || root.path : root.path;
        for (const file of inventory.files) {
            if (core.cancel)
                throw new native_1.AppError('CANCELED', '작업을 취소했어요.');
            if (chosen === 'structure')
                destinations[file] = node_path_1.default.join(base, node_path_1.default.dirname(inventory.relative[file]));
            else {
                const rec = prior?.find((r) => r.source === file)?.recommendation || await intelligence.recommend(root.id, file, folders);
                details[file] = rec;
                destinations[file] = !changed && selected?.[file] !== undefined ? selected[file] : rec.selected;
            }
        }
    }
    finally {
        core.busy = false;
        core.onChange();
    }
    const plan = await core.prepare(inventory.files, plant, mode, destinations, { folderImport: inventory.folders > 0, allowMissing: chosen === 'structure' || !!previous?.retryTask && previous.rows.some((r) => r.allowMissing) });
    plan.once = once;
    return { ...plan, rootId: root.id, inventory: inventory, layout: chosen, base, targetFolders: folders, rows: plan.rows.map(row => ({ ...row, relative: inventory.relative[row.source], reason: details[row.source]?.confidence === 'conflict' ? '분류 규칙이 충돌해요. 목적지를 직접 선택해 주세요.' : row.reason, recommendation: details[row.source] })) };
}
