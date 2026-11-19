"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_LIMIT = exports.TEXT_LIMIT = void 0;
exports.compareText = compareText;
const native_1 = require("./native");
exports.TEXT_LIMIT = 256 * 1024, exports.LINE_LIMIT = 1500;
function compareText(left, right) {
    function decode(bytes) {
        if (bytes.length > exports.TEXT_LIMIT)
            throw new native_1.AppError('DIFF', '텍스트 비교는 버전당 256KiB까지 지원해요.');
        let text;
        try {
            text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        }
        catch {
            throw new native_1.AppError('DIFF', 'UTF-8 텍스트만 비교할 수 있어요. 다른 인코딩은 별도로 열어 확인해 주세요.');
        }
        if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text))
            throw new native_1.AppError('DIFF', '바이너리 내용은 텍스트로 비교하지 않아요.');
        const lines = text ? text.replace(/\r\n/g, '\n').split('\n') : [];
        if (lines.length > exports.LINE_LIMIT)
            throw new native_1.AppError('DIFF', '텍스트 비교는 버전당 1,500줄까지 지원해요.');
        return { lines, crlf: /\r\n/.test(text), finalNewline: text.endsWith('\n') };
    }
    const a = decode(left), b = decode(right), n = a.lines.length, m = b.lines.length;
    // Bounded dynamic programming: at most 2.25M cells, no regex or external diff process.
    const grid = new Uint16Array((n + 1) * (m + 1)), at = (i, j) => i * (m + 1) + j;
    for (let i = n - 1; i >= 0; i--)
        for (let j = m - 1; j >= 0; j--)
            grid[at(i, j)] = a.lines[i] === b.lines[j] ? grid[at(i + 1, j + 1)] + 1 : Math.max(grid[at(i + 1, j)], grid[at(i, j + 1)]);
    const rows = [];
    let i = 0, j = 0, added = 0, removed = 0;
    while (i < n || j < m) {
        if (i < n && j < m && a.lines[i] === b.lines[j]) {
            rows.push({ kind: 'equal', text: a.lines[i], oldLine: ++i, newLine: ++j });
        }
        else if (i < n && (j === m || grid[at(i + 1, j)] >= grid[at(i, j + 1)])) {
            rows.push({ kind: 'remove', text: a.lines[i], oldLine: ++i, newLine: null });
            removed++;
        }
        else {
            rows.push({ kind: 'add', text: b.lines[j], oldLine: null, newLine: ++j });
            added++;
        }
    }
    return { rows, added, removed, identical: left.equals(right), lineEndingChanged: a.crlf !== b.crlf, fromFinalNewline: a.finalNewline, toFinalNewline: b.finalNewline };
}
