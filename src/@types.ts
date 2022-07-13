export interface jestOutput {
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
}
export interface TestResults {
  assertionResults: AssertionResults[];
  endTime?: number;
  message: string;
  name?: string;
  startTime?: number;
  status: 'failed' | 'pending' | 'passed';
  summary?: string;
}

export interface AssertionResults {
  ancestorTitles: string[];
  failureMessages: string[];
  fullName: string;
  location: {
    column: number;
    line: number;
  } | null;
  status: 'failed' | 'pending' | 'passed';
  title: string;
}
export enum GRADE_ERRORS {
  TIMEOUT_ERROR = 'TIMEOUT ERROR',
  SYNTAX_ERROR = 'SYNTAX ERROR',
  UNRECOGNIZED_ERROR = 'UNRECOGNIZED_ERROR',
}