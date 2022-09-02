FROM node:18.8.0

LABEL maintainer="Javier Brea <info@mocks-server.org>"
LABEL description="Mock server running live, interactive mocks in place of real APIs"

WORKDIR /usr/app

COPY ["./package.json", "./package.json"]
COPY ["./package-lock.json", "./package-lock.json"]

RUN npm i

ARG MOCKS_PLUGINS_INQUIRER_CLI_ENABLED=false
ENV MOCKS_PLUGINS_INQUIRER_CLI_ENABLED=$MOCKS_PLUGINS_INQUIRER_CLI_ENABLED

ARG MOCKS_FILES_PATH=/input/mocks
ENV MOCKS_FILES_PATH=$MOCKS_FILES_PATH

ARG MOCKS_CONFIG_FILE_SEARCH_FROM=/input
ENV MOCKS_CONFIG_FILE_SEARCH_FROM=$MOCKS_CONFIG_FILE_SEARCH_FROM

CMD ["npm", "start"]
