import { isAbsolute } from "node:path";

/** Environment setting naming the Node.js executable REA launches children with. */
export const NODE_EXECUTABLE_SETTING = "REA_NODE_BINARY";

/**
 * The Node.js executable used to launch REA's worker and child processes.
 *
 * `process.execPath` is a runnable program path only where the host execs the
 * Node binary directly. Under Android's Termux-style prefixes the binary's
 * PT_INTERP is the platform linker, so Node reports that linker (for example
 * `/apex/com.android.runtime/bin/linker64`) as its own executable; handing it
 * V8 flags then fails with "expected absolute path: --max-old-space-size".
 * `REA_NODE_BINARY` names the real executable there. It is unset by default,
 * which keeps every launch on `process.execPath` exactly as before.
 */
export const nodeExecutable = (
  environment: Readonly<Record<string, string | undefined>> = process.env,
): string => {
  const configured = environment[NODE_EXECUTABLE_SETTING]?.trim();
  if (configured === undefined || configured.length === 0)
    return process.execPath;
  if (!isAbsolute(configured))
    throw new Error(
      `${NODE_EXECUTABLE_SETTING} must be an absolute path to a Node.js executable; received ${JSON.stringify(configured)}.`,
    );
  return configured;
};
