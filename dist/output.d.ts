import { jestOutput, TestResults } from "./@types";
declare class Output implements jestOutput {
    numFailedTestSuites: number;
    numFailedTests: number;
    numPassedTestSuites: number;
    numPassedTests: number;
    numPendingTestSuites: number;
    numPendingTests: number;
    numRuntimeErrorTestSuites: number;
    numTodoTests: number;
    numTotalTestSuites: number;
    numTotalTests: number;
    openHandles: Error[];
    startTime: number;
    success: boolean;
    testResults: TestResults[];
    constructor();
    testSuccess(numFailedTestSuites: number, numFailedTests: number, numPassedTestSuites: number, numPassedTests: number, numPendingTestSuites: number, numPendingTests: number, numRuntimeErrorTestSuites: number, numTodoTests: number, numTotalTestSuites: number, numTotalTests: number, openHandles: Error[], startTime: number, testResults: TestResults[]): void;
    testFailed(message: string): void;
    testTimeout(): void;
    get results(): jestOutput;
}
export default Output;
