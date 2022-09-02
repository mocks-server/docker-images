import stripAnsi from "strip-ansi";

const NEW_LINE_CHAR = "\n";

function normalizePaths(str) {
  return str.replace(/\x1Bc/, "");
}

class SpawnerLogs {
  constructor({
    silent = true,
    normalizePaths: normalizePathsOption = true,
    stripAnsi: stripAnsiOption = true,
  } = {}) {
    this._silent = silent;
    this._normalizePaths = normalizePathsOption;
    this._stripAnsi = stripAnsiOption;

    this._lines = [];

    this.log = this.log.bind(this);
  }

  _cleanLog(log) {
    let newLog = log.trim();
    if (this._normalizePaths) {
      newLog = normalizePaths(log);
    }
    if (this._stripAnsi) {
      newLog = stripAnsi(log);
    }
    return newLog;
  }

  _logLine(log) {
    const cleanLog = this._cleanLog(log);
    if (cleanLog.length) {
      if (!this._silent) {
        console.log(cleanLog);
      }
      this._lines.push(cleanLog);
    }
  }

  _logLines(log) {
    const lines = log.split(NEW_LINE_CHAR);
    lines.forEach((lineLog) => {
      this._logLine(lineLog);
    });
  }

  log(log) {
    this._logLines(log);
  }

  _join(logs) {
    return logs.join(NEW_LINE_CHAR);
  }

  get all() {
    return this._join(this._lines);
  }

  get lines() {
    return [...this._lines];
  }

  flush() {
    this._lines = [];
  }
}

export default SpawnerLogs;
