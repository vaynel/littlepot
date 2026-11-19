"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiLabelFields = void 0;
exports.validateUILabels = validateUILabels;
exports.uiLabelFields = [
    ['homeTitle', '홈', 60], ['homeEyebrow', 'MY LITTLE WINDOWSILL', 60], ['homeDescription', '파일은 제자리에, 책상에는 작은 여유.', 160],
    ['overviewEyebrow', 'AT A GLANCE', 60], ['overviewTitle', '오늘의 창틀', 60], ['overviewDescription', '관리 중인 파일과 최근 정리를 한눈에 확인해요.', 160],
    ['folderMetric', '관리 폴더', 60], ['savedMetric', '보관한 파일', 60], ['organizedMetric', '정리한 파일', 60],
    ['sceneTitle', '나의 작은 창틀', 60], ['shortcutsTitle', '화분 바로가기', 60], ['shortcutNoun', '화분', 30], ['recentTitle', '최근 정리', 60],
    ['brandTitle', '작은 창틀', 60], ['sidebarCaption', '나의 작은 공간', 60], ['topCaption', '나만의 작은 생태계', 60],
    ['filesTitle', '내 파일', 60], ['themesTitle', '테마', 60], ['settingsTitle', '설정', 60], ['historyTitle', '정리 기록', 60]
];
function validateUILabels(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input))
        throw Error('INVALID_LABELS');
    const output = {};
    for (const [key, value] of Object.entries(input)) {
        const field = exports.uiLabelFields.find(f => f[0] === key);
        if (!field || typeof value !== 'string' || Array.from(value).length > field[2] || /[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(value))
            throw Error('INVALID_LABELS');
        if (value.trim())
            output[field[0]] = value.trim();
    }
    return output;
}
