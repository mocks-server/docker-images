import { doFetch, waitForServerUrl } from "../support/helpers";
import Spawner from "../support/Spawner";

describe("main image", () => {
  let dockerProcess;

  describe("When started without input files", () => {
    beforeAll(async () => {
      dockerProcess = new Spawner([
        "docker", "run", "-p", "3100:3100", "-p", "3110:3110", "mocks-server:main"
      ], {
        logs: {
          silent: false
        }
      });
      await waitForServerUrl("/api/users");
    });
  
    afterAll(async () => {
      await dockerProcess.kill();
    });

    it("should have created the scaffold", async () => {
      expect(dockerProcess.logs.all).toEqual(expect.stringContaining("Mocks Server folder was not found. A scaffold was created"));
    });

    it("should have created the config file", async () => {
      expect(dockerProcess.logs.all).toEqual(expect.stringContaining("Configuration file was not found. A scaffold was created"));
    });

    it("should have available the scaffold routes", async () => {
      const response = await doFetch("/api/users");
      expect(response.body).toEqual([{"id": 1, "name": "John Doe"}, {"id": 2, "name": "Jane Doe"}]);
    });

    it("should have info log level in the adminApi config route", async () => {
      const response = await doFetch("/api/config", { port: 3110 });
      expect(response.body.log).toEqual("info");
    });
  });
});
