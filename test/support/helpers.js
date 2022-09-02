import path from "path";

import waitOn from "wait-on";
import crossFetch from "cross-fetch";

import Spawner from "./Spawner";

const DEFAULT_SERVER_PORT = 3100;
const DEFAULT_SERVER_HOST = "127.0.0.1";

const defaultRequestOptions = {
  method: "get",
  headers: {
    "Content-Type": "application/json",
  },
};

function serverPort(port) {
  return port || DEFAULT_SERVER_PORT;
}

function serverUrl(port, protocol) {
  const protocolToUse = protocol || "http";
  return `${protocolToUse}://${DEFAULT_SERVER_HOST}:${serverPort(port)}`;
}

export function doFetch(uri, options = {}) {
  const requestOptions = {
    ...defaultRequestOptions,
    ...options,
  };
  if (requestOptions.body) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  return crossFetch(`${serverUrl(options.port, options.protocol)}${uri}`, {
    ...requestOptions,
  }).then((res) => {
    return res
      .json()
      .then((processedRes) => ({
        body: processedRes,
        status: res.status,
        headers: res.headers,
        url: res.url,
      }))
      .catch(() => {
        return { status: res.status, headers: res.headers, url: res.url };
      });
  });
}

export function waitForServer(port) {
  return waitOn({ resources: [`tcp:${DEFAULT_SERVER_HOST}:${serverPort(port)}`] });
}

export function waitForServerUrl(url, options = {}) {
  return waitOn({ resources: [`${serverUrl(options.port, options.protocol)}${url}`] });
}

export function fixturesPath(subPath) {
  return path.resolve(__dirname, "..", "fixtures", subPath);
}

export async function cleanDocker() {
  const pruneContainersProcess = new Spawner(["docker", "container", "prune", "-f"]);
  await pruneContainersProcess.hasExited();
  const listVolumesProcess = new Spawner(["docker", "volume", "ls", "-q"]);
  await listVolumesProcess.hasExited();
  const volumes = listVolumesProcess.logs.lines;
  if (volumes.length) {
    const process = new Spawner(["docker", "volume", "rm", ...volumes]);
    await process.hasExited();
  }
}

export function wait(time = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
