"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRootOrder = validateRootOrder;
// UI order only: never rename a directory or change a plant binding.
function validateRootOrder(value, available) {
    if (!Array.isArray(value) || value.length > 10000 || value.some(id => typeof id !== 'string' || !available.includes(id)) || new Set(value).size !== value.length)
        throw new Error('Invalid managed folder order');
    return [...value, ...available.filter(id => !value.includes(id))];
}
