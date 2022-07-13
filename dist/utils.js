"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFiles = exports.copyFolder = exports.copyFile = exports.deleteFolder = exports.getAllFilesInTheFolder = exports.getAllDirectoriesInTheFolder = exports.createFolderIfDoesntExist = exports.checkIfDirectoryExists = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
function checkIfDirectoryExists(path) {
    return fs_1.promises
        .access(path)
        .then(() => true)
        .catch(() => false);
}
exports.checkIfDirectoryExists = checkIfDirectoryExists;
function createFolderIfDoesntExist(dir) {
    return checkIfDirectoryExists(dir).then((exists) => {
        if (!exists)
            return fs_1.promises.mkdir(dir).then(() => true);
        return true;
    });
}
exports.createFolderIfDoesntExist = createFolderIfDoesntExist;
function getAllDirectoriesInTheFolder(folder) {
    return fs_1.promises.readdir(folder, { withFileTypes: true }).then((dirents) => {
        return dirents
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    });
}
exports.getAllDirectoriesInTheFolder = getAllDirectoriesInTheFolder;
function getAllFilesInTheFolder(folder) {
    return fs_1.promises.readdir(folder, { withFileTypes: true }).then((dirents) => {
        return dirents
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name);
    });
}
exports.getAllFilesInTheFolder = getAllFilesInTheFolder;
function deleteFolder(folder) {
    return fs_1.promises.rmdir(folder, { recursive: true });
}
exports.deleteFolder = deleteFolder;
function copyFile(source, target) {
    return fs_1.promises
        .readFile(source)
        .then((sourceFile) => fs_1.promises.writeFile(target, sourceFile));
}
exports.copyFile = copyFile;
function copyFolder(source, target) {
    return fs_1.promises.lstat(source).then((sourceStats) => {
        if (sourceStats.isDirectory()) {
            return createFolderIfDoesntExist(target)
                .then(() => fs_1.promises.readdir(source))
                .then((files) => {
                return Promise.all(files.map((file) => copyFolder(path_1.default.join(source, file), path_1.default.join(target, file)))).then(() => undefined);
            });
        }
        else if (sourceStats.isFile()) {
            return copyFile(source, target);
        }
        return;
    });
}
exports.copyFolder = copyFolder;
function parseFiles(source, parserCb) {
    return fs_1.promises.lstat(source).then((sourceStats) => {
        if (sourceStats.isDirectory()) {
            return fs_1.promises.readdir(source).then((files) => {
                return Promise.all(files.map((file) => parseFiles(path_1.default.join(source, file), parserCb))).then(() => undefined);
            });
        }
        else if (sourceStats.isFile()) {
            return fs_1.promises
                .readFile(source)
                .then((sourceFile) => fs_1.promises.writeFile(source, parserCb(sourceFile.toString())));
        }
        return;
    });
}
exports.parseFiles = parseFiles;
//# sourceMappingURL=utils.js.map