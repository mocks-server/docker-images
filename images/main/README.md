## About Mocks Server

Mocks Server is a Node.js mock server running live, interactive mocks in place of real APIs. __It makes able to define many different responses for a same route__, so, you can change the whole mocked API behavior by simply changing the response of one or many routes while the server is running.

### Usage

Define your mocked API routes in YAML, JSON, JavaScript or TypeScript files. Mocks Server loads them automatically and watches for changes. Defining routes using any of the available APIs is also possible.

Routes can be defined in many ways, from plain objects to plain text and even Express middlewares, and they can act in different ways also, from sending a response to proxy the request to another host.

Providing many integration tools, the mock responses can be changed using REST API, JavaScript, Cypress commands, an interactive CLI, etc.

## Documentation

[Read the project documentation here](https://www.mocks-server.org)

## Docker usage

The `mocksserver/main` Docker image includes the `@mocks-server/main` NPM distribution. It can be started using `docker run` as in the next example:

```sh
docker run -ti -p 3100:3100 -p 3110:3110 mocksserver/main
```

This will start Mocks Server, and, as no "mocks" folder nor the configuration file were provided, it will create a scaffold. If you hit the next URLs you'll see:

* http://localhost:3100/api/users - An example route response contained in the scaffold
* http://localhost:3110 - The Swagger UI of the administration REST API

## Providing routes, collections and config file

The Mocks Server application in the Docker image is pre-configured to search for the `mocks` folder (which contains routes and collections) and the configuration file in the `/input` folder. So, you can follow all of the guidelines about organizing files described in the [project documentation](https://www.mocks-server.org), and simply mount the same structure in the `/input` folder of the Docker container.

Let's assume that you have the next file tree:

```
project/
├── mocks/
│   ├── routes/ <- DEFINE YOUR ROUTES HERE
│   │   ├── common.js
│   │   └── users.js
│   └── collections.json <- DEFINE YOUR COLLECTIONS HERE
└── mocks.config.js <- DEFINE YOUR CONFIGURATION HERE
```

Then, you can mount your `/project` folder as `/input` folder in the container:

```sh
docker run -ti -p 3100:3100 -p 3110:3110 \
  -v /Users/foo/project:/input \
  mocksserver/main
```

Now, Mocks Server will find your routes, collections and configuration file, and it will start your mock server!

## Configuration

As described in the [How to change settings docs page](https://www.mocks-server.org/docs/configuration/how-to-change-settings/), environment variables can be used to change the Mocks Server configuration. So, simply pass the corresponding environment variables to the container:

```sh
docker run -ti -p 3100:3100 -p 3110:3110 \
  -v /Users/foo/project:/input \
  -e MOCKS_LOG=debug
  mocksserver/main
```

The Docker image includes some pre-configuration to make easier to use the app through Docker, but you can change these options using environment variables as well in case you want to customize your container:

* `MOCKS_PLUGINS_INQUIRER_CLI_ENABLED=false`. The interactive CLI is disabled by default
* `MOCKS_FILES_PATH=/input/mocks`. The mocks path is set as `/input/mocks` by default.
* `MOCKS_CONFIG_FILE_SEARCH_FROM=/input`. The configuration file is expected to be in the `/input` folder.

> ⚠️ CAUTION
> 
> When setting paths in your configuration, take into account that the application in the container is running in the `/usr/app` folder, so, that is the `process.cwd` used for resolving relative paths. So, using absolute paths in the configuration is recommended.
