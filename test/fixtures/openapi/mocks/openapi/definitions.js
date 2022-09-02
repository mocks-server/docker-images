module.exports = [
  {
    basePath: "/api",
    document: {
      openapi: "3.1.0",
      info: {
        version: "1.0.0",
        title: "Testing API",
        description: "OpenApi document to create mock for testing purpses",
      },
      paths: {
        "/books": {
          get: {
            summary: "Return all users",
            description: "Use it to get current users",
            responses: {
              "200": {
                description: "successful operation",
                content: {
                  "application/json": {
                    examples: {
                      success: {
                        summary: "One route",
                        value: {
                          $ref: "../fixtures/books.json",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "/books/{id}": {
          get: {
            parameters: [
              {
                name: "id",
                in: "path",
                description: "ID",
                required: true,
                schema: {
                  type: "string",
                },
              },
            ],
            summary: "Return one book",
            responses: {
              "200": {
                description: "successful operation",
                content: {
                  "application/json": {
                    examples: {
                      success: {
                        summary: "One book",
                        value: {
                          $ref: "../fixtures/book.json",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
];
