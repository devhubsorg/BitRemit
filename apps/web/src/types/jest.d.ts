declare namespace jest {
  type Mock<T = any, Y extends any[] = any[]> = {
    (...args: Y): T;
    mockResolvedValue: (value: T) => Mock<T, Y>;
    mockRejectedValue: (value: any) => Mock<T, Y>;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockResolvedValueOnce: (value: T) => Mock<T, Y>;
    mockRejectedValueOnce: (value: any) => Mock<T, Y>;
    mockReturnValueOnce: (value: T) => Mock<T, Y>;
    mockReturnThis: () => Mock<T, Y>;
    mockClear: () => void;
    mockReset: () => void;
    mockRestore: () => void;
    mock: {
      calls: Y[];
      results: { type: 'return' | 'throw'; value: T }[];
      instances: any[];
      lastCall: Y;
    };
  } & Function;

  function fn<T = any, Y extends any[] = any[]>(implementation?: (...args: Y) => T): Mock<T, Y>;
  function mock(moduleName: string, factory?: () => any, options?: any): void;
  function clearAllMocks(): void;
  function requireActual(moduleName: string): any;
}

declare var jest: typeof jest;
declare var describe: (name: string, fn: () => void) => void;
declare var test: (name: string, fn: () => Promise<void> | void) => void;
declare var it: (name: string, fn: () => Promise<void> | void) => void;
declare var beforeEach: (fn: () => Promise<void> | void) => void;
declare var afterEach: (fn: () => Promise<void> | void) => void;
declare var beforeAll: (fn: () => Promise<void> | void) => void;
declare var afterAll: (fn: () => Promise<void> | void) => void;

interface Expect {
  (actual: any): any;
  objectContaining: (obj: object) => any;
  stringContaining: (str: string) => any;
  anything: () => any;
  any: (constructor: any) => any;
  arrayContaining: (arr: any[]) => any;
}

declare var expect: Expect;
