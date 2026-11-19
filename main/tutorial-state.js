"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tutorialProgress = tutorialProgress;
function tutorialProgress(state) {
    const tutorial = state.tutorial;
    const roots = (state.managed?.roots || []).filter((r) => r.active);
    const plant = state.plants.find((p) => p.folder && roots.some((r) => r.path === p.folder));
    const operations = tutorial?.status === 'active' ? (state.ops || []).filter((o) => o.status === 'completed' && o.created >= tutorial.startedAt && !tutorial.baseline.includes(o.id)) : [];
    const saved = operations.find((o) => (state.aftercare?.items || []).some((a) => a.operation === o.id && a.status === 'completed' && !a.kind.startsWith('undo')));
    const operation = saved || operations[0];
    const job = operation ? (state.aftercare?.items || []).find((a) => a.operation === operation.id && !a.kind.startsWith('undo')) : null;
    return { plant, operation, job, step: !roots.length ? 0 : !operation ? 1 : 2, complete: !!saved };
}
