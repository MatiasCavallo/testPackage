export declare function checkIfDirectoryExists(path: string): Promise<boolean>;
export declare function createFolderIfDoesntExist(dir: string): Promise<boolean>;
export declare function getAllDirectoriesInTheFolder(folder: string): Promise<string[]>;
export declare function getAllFilesInTheFolder(folder: string): Promise<string[]>;
export declare function deleteFolder(folder: string): Promise<void>;
export declare function copyFile(source: string, target: string): Promise<void>;
export declare function copyFolder(source: string, target: string): Promise<void>;
export declare function parseFiles(source: string, parserCb: (file: string) => string): Promise<void>;
