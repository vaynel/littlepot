"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.managedSql = exports.filePathKey = void 0;
exports.fileControlsSchema = fileControlsSchema;
exports.fileExcluded = fileExcluded;
const node_path_1 = __importDefault(require("node:path"));
function fileControlsSchema(db) { db.exec(`CREATE TABLE IF NOT EXISTS file_controls(file TEXT PRIMARY KEY,root TEXT NOT NULL,path TEXT NOT NULL,path_key TEXT NOT NULL,state TEXT NOT NULL,updated INTEGER NOT NULL); CREATE INDEX IF NOT EXISTS controls_path ON file_controls(root,path_key,state);`); }
const filePathKey = (p) => process.platform === 'win32' ? node_path_1.default.resolve(p).toLowerCase() : node_path_1.default.resolve(p);
exports.filePathKey = filePathKey;
function fileExcluded(db, root, p) { return !!db.prepare("SELECT file FROM file_controls WHERE root=? AND path_key=? AND state='off' LIMIT 1").get(root, (0, exports.filePathKey)(p)); }
exports.managedSql = "NOT EXISTS (SELECT 1 FROM file_controls fc WHERE fc.file=f.id AND fc.state='off')";
