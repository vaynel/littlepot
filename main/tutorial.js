"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTutorial = changeTutorial;
const native_1 = require("./native");
const tutorial_state_1 = require("./tutorial-state");
function changeTutorial(core, command, state) {
    if (command === 'start')
        core.setSetting('tutorial', { status: 'active', startedAt: Date.now(), baseline: core.state().ops.map(o => o.id) });
    else if (command === 'skip' || command === 'finish') {
        const current = core.setting('tutorial', null);
        if (!current || current.status !== 'active')
            throw new native_1.AppError('GUIDE', '먼저 튜토리얼을 시작해 주세요.');
        if (command === 'finish' && !(0, tutorial_state_1.tutorialProgress)(state).complete)
            throw new native_1.AppError('GUIDE', '파일 전달과 버전 보관이 끝난 뒤 완료할 수 있어요.');
        core.setSetting('tutorial', { ...current, status: command === 'finish' ? 'completed' : 'skipped' });
    }
    else
        throw new native_1.AppError('GUIDE', '안내 진행을 확인해 주세요.');
    // The guided lesson supersedes the persistent onboarding banner.
    core.setSetting('guide', { step: 0, status: 'completed', version: 1 });
    core.setSetting('onboarded', true);
    core.onChange();
}
