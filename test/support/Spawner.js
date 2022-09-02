import crossSpawn from "cross-spawn";
import treeKill from "tree-kill";

import Logs from "./SpawnerLogs";

const ENCODING_TYPE = "utf8";

class Spawner {
  constructor(commandAndArguments, options = {}) {
    this._command = this._getCommandToExecute(commandAndArguments);
    this._logger = new Logs(options.logs);
    this._cwd = options.cwd;
    this._env = options.env;

    this._exitPromise = new Promise((resolve) => {
      this._resolveExitPromise = resolve;
    });

    this.run();
  }

  _getCommandToExecute(commandAndArguments) {
    return {
      name: commandAndArguments[0],
      params: commandAndArguments.splice(1, commandAndArguments.length - 1),
    };
  }

  run() {
    try {
      this._cliProcess = crossSpawn(this._command.name, this._command.params, {
        cwd: this._cwd,
        env: {
          ...process.env,
          ...this._env,
        },
      });
      this._cliProcess.stdin.setEncoding(ENCODING_TYPE);

      this._cliProcess.stdout.setEncoding(ENCODING_TYPE);
      this._cliProcess.stderr.setEncoding(ENCODING_TYPE);

      this._cliProcess.stdout.on("data", this._logger.log);
      this._cliProcess.stderr.on("data", this._logger.log);

      this._cliProcess.on("close", (code) => {
        this._exitCode = code;
        this._resolveExitPromise();
      });
    } catch (error) {
      console.log("Error starting process");
      console.log(error);
      this._exitCode = 1;
      this._resolveExitPromise();
    }
  }

  async kill() {
    if (this._cliProcess.pid) {
      treeKill(this._cliProcess.pid);
    }
    return this._exitPromise;
  }

  async hasExited() {
    return this._exitPromise;
  }

  get exitCode() {
    return this._exitCode;
  }

  get logs() {
    return this._logger;
  }
}

export default Spawner;
