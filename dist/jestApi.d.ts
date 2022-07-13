import { jestOutput } from "./@types";
declare class JestAPI {
    constructor();
    executeTestCommand(command: string, cwd: string): Promise<string>;
    runTest(cwd: string, testsPattern: string, outputPath: string): Promise<string>;
    runAllTests(cwd: string, instanceTestPath: string, instanceTestPattern: string, outputPath: string): Promise<jestOutput>;
}
export default JestAPI;
