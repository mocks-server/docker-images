# Mocks Server Docker images

Docker images with [Mocks Server](https://www.mocks-server.org) dependencies and command to start it.

# Docker images

Next Docker images are hosted in this repository:

* [mocksserver/main](https://hub.docker.com/repository/docker/mocksserver/main) - Docker image with `@mocks-server/main` NPM distribution installed and pre-configured.

# Development

## Prerequisites

* You must have Docker installed
* You must have Node.js v18.8.8 and NPM installed.

## Testing

For running tests locally, follow the next steps:

* Install the dependencies
  ```sh
  npm i
  ```
* Build the Docker image and tag it as `mocks-server:main`
  ```sh
  cd images/main
  docker build . -t mocks-server:main
  ```
* Run the tests using the NPM script in the root folder:
  ```sh
  npm run test
  ```