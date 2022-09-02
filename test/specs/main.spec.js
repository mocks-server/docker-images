import { doFetch, waitForServerUrl, fixturesPath, cleanDocker, wait } from "../support/helpers";
import Spawner from "../support/Spawner";

const DOCKER_TIMEOUT_LIMIT = 60000;
const DOCKER_COURTESY_TIME = 10000;

describe("main image", () => {
  let dockerProcess;

  afterAll(async () => {
    await cleanDocker();
  }, DOCKER_TIMEOUT_LIMIT);

  describe("When started without input files", () => {
    beforeAll(async () => {
      await cleanDocker();
      dockerProcess = new Spawner([
        "docker",
        "run",
        "-p",
        "3100:3100",
        "-p",
        "3110:3110",
        "mocks-server:main",
      ]);
      await waitForServerUrl("/api/users");
    }, DOCKER_TIMEOUT_LIMIT);

    afterAll(async () => {
      await dockerProcess.kill();
      await wait(DOCKER_COURTESY_TIME);
    }, DOCKER_TIMEOUT_LIMIT);

    it("should have created the scaffold", async () => {
      expect(dockerProcess.logs.all).toEqual(
        expect.stringContaining("Mocks Server folder was not found. A scaffold was created")
      );
    });

    it("should have created the config file", async () => {
      expect(dockerProcess.logs.all).toEqual(
        expect.stringContaining("Configuration file was not found. A scaffold was created")
      );
    });

    it("should have not started the interactive CLI", async () => {
      expect(dockerProcess.logs.all).toEqual(expect.not.stringContaining("Select action:"));
    });

    it("should have available the scaffold routes", async () => {
      const response = await doFetch("/api/users");
      expect(response.body).toEqual([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
      ]);
    });

    it("should have info log level in the adminApi config route", async () => {
      const response = await doFetch("/api/config", { port: 3110 });
      expect(response.body.log).toEqual("info");
    });
  });

  describe("When the mocks folder is mounted", () => {
    beforeAll(async () => {
      await cleanDocker();
      dockerProcess = new Spawner(
        [
          "docker",
          "run",
          "-v",
          `${fixturesPath("project/mocks")}:/input/mocks`,
          "-p",
          "3100:3100",
          "-p",
          "3110:3110",
          "mocks-server:main",
        ],
        {}
      );
      await waitForServerUrl("/api/books");
    }, DOCKER_TIMEOUT_LIMIT);

    afterAll(async () => {
      await dockerProcess.kill();
      await wait(DOCKER_COURTESY_TIME);
    }, DOCKER_TIMEOUT_LIMIT);

    it("should have not created the scaffold", async () => {
      expect(dockerProcess.logs.all).toEqual(
        expect.not.stringContaining("Mocks Server folder was not found. A scaffold was created")
      );
    });

    it("should have created the config file", async () => {
      expect(dockerProcess.logs.all).toEqual(
        expect.stringContaining("Configuration file was not found. A scaffold was created")
      );
    });

    it("should have available the books route", async () => {
      const response = await doFetch("/api/books");
      expect(response.body).toEqual([
        {
          id: 1,
          title: "1984",
        },
        {
          id: 2,
          title: "Brave New World",
        },
      ]);
    });

    it("should have available the book route", async () => {
      const response = await doFetch("/api/books/1");
      expect(response.body).toEqual({
        id: 1,
        title: "1984",
      });
    });
  });

  describe("When mocks and config are mounted", () => {
    beforeAll(async () => {
      await cleanDocker();
      dockerProcess = new Spawner([
        "docker",
        "run",
        "-v",
        `${fixturesPath("project")}:/input`,
        "-p",
        "3100:3100",
        "-p",
        "3110:3110",
        "mocks-server:main",
      ]);
      await waitForServerUrl("/api/books");
    }, DOCKER_TIMEOUT_LIMIT);

    afterAll(async () => {
      await dockerProcess.kill();
      await wait(DOCKER_COURTESY_TIME);
    }, DOCKER_TIMEOUT_LIMIT);

    it("should have not created the scaffold", async () => {
      expect(dockerProcess.logs.all).toEqual(
        expect.not.stringContaining("Mocks Server folder was not found. A scaffold was created")
      );
    });

    it("should have not created the config file", async () => {
      expect(dockerProcess.logs.all).toEqual(
        expect.not.stringContaining("Configuration file was not found. A scaffold was created")
      );
    });

    it("should have not logged silly logs", async () => {
      expect(dockerProcess.logs.all).toEqual(expect.not.stringContaining("[silly]"));
    });

    it("should have logged debug logs", async () => {
      expect(dockerProcess.logs.all).toEqual(expect.stringContaining("[debug]"));
    });

    it("should have debug log level in the adminApi config route", async () => {
      const response = await doFetch("/api/config", { port: 3110 });
      expect(response.body.log).toEqual("debug");
    });

    it("should have available the books route", async () => {
      const response = await doFetch("/api/books");
      expect(response.body).toEqual([
        {
          id: 1,
          title: "1984",
        },
        {
          id: 2,
          title: "Brave New World",
        },
      ]);
    });

    it("should have available the book route", async () => {
      const response = await doFetch("/api/books/1");
      expect(response.body).toEqual({
        id: 1,
        title: "1984",
      });
    });
  });
});
