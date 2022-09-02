const BOOKS = require("../fixtures/books");

module.exports = [
  {
    id: "get-books",
    url: "/api/books",
    method: "get",
    variants: [
      {
        id: "success",
        type: "json",
        options: {
          status: 200,
          body: BOOKS,
        },
      },
    ],
  },
  {
    id: "get-book",
    url: "/api/books/:id",
    method: "get",
    variants: [
      {
        id: "success",
        type: "json",
        options: {
          status: 200,
          body: BOOKS[0],
        },
      },
    ],
  },
];
