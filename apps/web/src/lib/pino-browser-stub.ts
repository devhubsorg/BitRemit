type PinoBindings = Record<string, unknown>;

type PinoLogger = {
  level: string;
  child: (bindings?: PinoBindings) => PinoLogger;
  bindings: () => PinoBindings;
  trace: (..._args: unknown[]) => void;
  debug: (..._args: unknown[]) => void;
  info: (..._args: unknown[]) => void;
  warn: (..._args: unknown[]) => void;
  error: (..._args: unknown[]) => void;
};

export const levels = {
  values: {
    trace: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
  },
};

function createLogger(
  opts?: { level?: string },
  _destination?: unknown,
): PinoLogger {
  const logger: PinoLogger & { _bindings?: PinoBindings } = {
    level: opts?.level ?? "info",
    child(bindings: PinoBindings = {}) {
      const child = createLogger(opts, _destination) as PinoLogger & {
        _bindings?: PinoBindings;
      };
      child._bindings = {
        ...(logger._bindings ?? {}),
        ...bindings,
      };
      return child;
    },
    bindings() {
      return logger._bindings ?? {};
    },
    trace() {},
    debug() {},
    info() {},
    warn() {},
    error() {},
  };

  return logger;
}

export default createLogger;
