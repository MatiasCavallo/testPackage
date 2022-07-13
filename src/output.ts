import { GRADE_ERRORS, jestOutput, TestResults } from "./@types";

class Output implements jestOutput {
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

  constructor() {
    this.numFailedTestSuites = 0;
    this.numFailedTests = 0;
    this.numPassedTestSuites = 0;
    this.numPassedTests = 0;
    this.numPendingTestSuites = 0;
    this.numPendingTests = 0;
    this.numRuntimeErrorTestSuites = 0;
    this.numTodoTests = 0;
    this.numTotalTestSuites = 0;
    this.numTotalTests = 0;
    this.openHandles = [];
    this.startTime = 0;
    this.success = true;
    this.testResults = [];
  }

  testSuccess(
    numFailedTestSuites: number,
    numFailedTests: number,
    numPassedTestSuites: number,
    numPassedTests: number,
    numPendingTestSuites: number,
    numPendingTests: number,
    numRuntimeErrorTestSuites: number,
    numTodoTests: number,
    numTotalTestSuites: number,
    numTotalTests: number,
    openHandles: Error[],
    startTime: number,
    testResults: TestResults[],
  ) {
    this.numFailedTestSuites += numFailedTestSuites;
    this.numFailedTests += numFailedTests;
    this.numPassedTestSuites += numPassedTestSuites;
    this.numPassedTests += numPassedTests;
    this.numPendingTestSuites += numPendingTestSuites;
    this.numPendingTests += numPendingTests;
    this.numRuntimeErrorTestSuites += numRuntimeErrorTestSuites;
    this.numTodoTests = +numTodoTests;
    this.numTotalTestSuites = +numTotalTestSuites;
    this.numTotalTests = +numTotalTests;
    if (openHandles.length) {
      this.openHandles = [...this.openHandles, ...openHandles];
    }

    this.success = true;

    this.startTime = this.startTime < startTime ? startTime : this.startTime;
    if (testResults.length) {
      this.testResults = [...this.testResults, ...testResults];
    }
  }
  testFailed(message: string) {
    this.numTotalTestSuites += 1;
    this.numFailedTestSuites += 1;
    this.testResults.push({
      message: GRADE_ERRORS.UNRECOGNIZED_ERROR,
      status: 'failed',
      summary: message,
      assertionResults: [],
    });
  }
  testTimeout() {
    this.numTotalTestSuites += 1;
    this.numFailedTestSuites += 1;
    this.testResults.push({
      message: GRADE_ERRORS.TIMEOUT_ERROR,
      status: 'failed',
      summary: '',
      assertionResults: [],
    });
  }
  get results(): jestOutput {
    return {
      numFailedTestSuites: this.numFailedTestSuites,
      numFailedTests: this.numFailedTests,
      numPassedTestSuites: this.numPassedTestSuites,
      numPassedTests: this.numPassedTests,
      numPendingTestSuites: this.numPendingTestSuites,
      numPendingTests: this.numPendingTests,
      numRuntimeErrorTestSuites: this.numRuntimeErrorTestSuites,
      numTodoTests: this.numTodoTests,
      numTotalTestSuites: this.numTotalTestSuites,
      numTotalTests: this.numTotalTests,
      openHandles: this.openHandles,
      startTime: this.startTime,
      success: this.success,
      testResults: this.testResults,
    };
  }
}

export default Output