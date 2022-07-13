"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _types_1 = require("./@types");
const output_1 = __importDefault(require("./output"));
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const utils_1 = require("./utils");
class JestAPI {
    constructor() { }
    executeTestCommand(command, cwd) {
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(command, { cwd, timeout: 10000 }, (stderr, stdout) => {
                if (stderr) {
                    console.error(stderr);
                    if (stderr.killed) {
                        resolve(_types_1.GRADE_ERRORS.TIMEOUT_ERROR);
                    }
                    else if (/SyntaxError/g.test(stderr.message)) {
                        resolve(_types_1.GRADE_ERRORS.SYNTAX_ERROR);
                    }
                    else if (stderr.code === 1 && stderr.signal === null) {
                        resolve(stderr.message);
                    }
                    else {
                        reject(stderr);
                    }
                }
                else {
                    console.log(stdout);
                    resolve(stdout);
                }
            });
        });
    }
    runTest(cwd, testsPattern, outputPath) {
        return this.executeTestCommand(`node node_modules/jest/bin/jest.js ${testsPattern} --outputFile=${outputPath} --colors --json`, cwd);
    }
    runAllTests(cwd, instanceTestPath, instanceTestPattern, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield (0, utils_1.getAllFilesInTheFolder)(instanceTestPath);
            let finalOutput = new output_1.default();
            for (let i = 0; i < files[i].length; i++) {
                let file = files[i];
                const outputFile = `${outputPath}/${i + 1}.json`;
                const output = yield this.runTest(cwd, `./${instanceTestPattern}${file}`, outputFile);
                if (_types_1.GRADE_ERRORS.TIMEOUT_ERROR === output) {
                    finalOutput.testTimeout();
                }
                else {
                    try {
                        const output = yield fs_1.promises.readFile(outputFile);
                        const jestOutput = JSON.parse(output.toString());
                        finalOutput.testSuccess(jestOutput.numFailedTestSuites, jestOutput.numFailedTests, jestOutput.numPassedTestSuites, jestOutput.numPassedTests, jestOutput.numPendingTestSuites, jestOutput.numPendingTests, jestOutput.numRuntimeErrorTestSuites, jestOutput.numTodoTests, jestOutput.numTotalTestSuites, jestOutput.numTotalTests, jestOutput.openHandles, jestOutput.startTime, jestOutput.testResults);
                    }
                    catch (error) {
                        let message;
                        if (error instanceof Error) {
                            message = error.message;
                        }
                        else {
                            message = error;
                        }
                        finalOutput.testFailed(message);
                    }
                }
            }
            return finalOutput.results;
        });
    }
}
exports.default = JestAPI;
//# sourceMappingURL=jestApi.js.map