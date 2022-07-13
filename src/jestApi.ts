import { GRADE_ERRORS, jestOutput } from "./@types";
import Output from "./output";
import { promises as fs} from 'fs'
import { exec } from "child_process";
import { getAllFilesInTheFolder } from "./utils";
class JestAPI {
  constructor() {}
  executeTestCommand(command: string, cwd: string) {
    return new Promise<string>((resolve, reject) => {
      exec(command, { cwd, timeout: 10000 }, (stderr, stdout) => {
        if (stderr) {
          console.error(stderr);
          if (stderr.killed) {
            resolve(GRADE_ERRORS.TIMEOUT_ERROR);
          } else if (/SyntaxError/g.test(stderr.message)) {
            resolve(GRADE_ERRORS.SYNTAX_ERROR);
          } else if (stderr.code === 1 && stderr.signal === null) {
            resolve(stderr.message);
          } else {
            reject(stderr);
          }
        } else {
          console.log(stdout);
          resolve(stdout);
        }
      });
    });
  }

  runTest(cwd: string, testsPattern: string, outputPath: string) {
    return this.executeTestCommand(
      `node node_modules/jest/bin/jest.js ${testsPattern} --outputFile=${outputPath} --colors --json`,
      cwd,
    );
  }
  async runAllTests(
    cwd: string,
    instanceTestPath: string,
    instanceTestPattern: string,
    outputPath: string,
  ) {
    const files = await getAllFilesInTheFolder(instanceTestPath);

    let finalOutput = new Output();
    for (let i = 0; i < files[i].length; i++) {
      let file = files[i];
      const outputFile = `${outputPath}/${i + 1}.json`;
      const output = await this.runTest(
        cwd,
        `./${instanceTestPattern}${file}`,
        outputFile,
      );
      if (GRADE_ERRORS.TIMEOUT_ERROR === output) {
        finalOutput.testTimeout();
      } else {
        try {
          const output = await fs.readFile(outputFile);
          const jestOutput: jestOutput = JSON.parse(output.toString());
          finalOutput.testSuccess(
            jestOutput.numFailedTestSuites,
            jestOutput.numFailedTests,
            jestOutput.numPassedTestSuites,
            jestOutput.numPassedTests,
            jestOutput.numPendingTestSuites,
            jestOutput.numPendingTests,
            jestOutput.numRuntimeErrorTestSuites,
            jestOutput.numTodoTests,
            jestOutput.numTotalTestSuites,
            jestOutput.numTotalTests,
            jestOutput.openHandles,
            jestOutput.startTime,
            jestOutput.testResults,
          );
        } catch (error) {
          let message: string 
          if(error instanceof Error ){
            message = error.message
          }else{
            message = error as string
          }
          finalOutput.testFailed(message);
        }
      }
    }
    return finalOutput.results;
  }
}

export default JestAPI