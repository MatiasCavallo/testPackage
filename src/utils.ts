import { promises as fs } from 'fs';
import path from 'path';

export function checkIfDirectoryExists(path: string) {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
}

export function createFolderIfDoesntExist(dir: string) {
  return checkIfDirectoryExists(dir).then((exists) => {
    if (!exists) return fs.mkdir(dir).then(() => true);
    return true;
  });
}

export function getAllDirectoriesInTheFolder(folder: string) {
  return fs.readdir(folder, { withFileTypes: true }).then((dirents) => {
    return dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  });
}

export function getAllFilesInTheFolder(folder: string) {
  return fs.readdir(folder, { withFileTypes: true }).then((dirents) => {
    return dirents
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);
  });
}

export function deleteFolder(folder: string) {
  return fs.rmdir(folder, { recursive: true });
}

export function copyFile(source: string, target: string) {
  return fs
    .readFile(source)
    .then((sourceFile) => fs.writeFile(target, sourceFile));
}

export function copyFolder(source: string, target: string): Promise<void> {
  return fs.lstat(source).then((sourceStats) => {
    if (sourceStats.isDirectory()) {
      return createFolderIfDoesntExist(target)
        .then(() => fs.readdir(source))
        .then((files) => {
          return Promise.all(
            files.map((file) =>
              copyFolder(path.join(source, file), path.join(target, file)),
            ),
          ).then(() => undefined);
        });
    } else if (sourceStats.isFile()) {
      return copyFile(source, target);
    }
    return;
  });
}

export function parseFiles(
  source: string,
  parserCb: (file: string) => string,
): Promise<void> {
  return fs.lstat(source).then((sourceStats) => {
    if (sourceStats.isDirectory()) {
      return fs.readdir(source).then((files) => {
        return Promise.all(
          files.map((file) => parseFiles(path.join(source, file), parserCb)),
        ).then(() => undefined);
      });
    } else if (sourceStats.isFile()) {
      return fs
        .readFile(source)
        .then((sourceFile) =>
          fs.writeFile(source, parserCb(sourceFile.toString())),
        );
    }
    return;
  });
}
