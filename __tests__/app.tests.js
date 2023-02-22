const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { expect } = require("@jest/globals");
const comments = require("../db/data/test-data/comments");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("app", () => {
  describe("Successful requests", () => {
    describe("/api/topics", () => {
      test("200 GET: responds with an array of topics objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const { topics } = body;
            topics.forEach((topic) => {
              expect(topic).toHaveProperty("slug", expect.any(String));
              expect(topic).toHaveProperty("description", expect.any(String));
            });
            expect(topics.length).toBe(3);
          });
      });
    });

    describe("/api/articles", () => {
      test("200 GET: responds with an array of articles sorted in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            articles.forEach((article) => {
              expect(article).toHaveProperty("author", expect.any(String));
              expect(article).toHaveProperty("title", expect.any(String));
              expect(article).toHaveProperty("article_id", expect.any(Number));
              expect(article).toHaveProperty(
                "comment_count",
                expect.any(Number)
              );
              expect(article).toHaveProperty("created_at", expect.any(String));
              expect(article).toHaveProperty("votes", expect.any(Number));
              expect(article).toHaveProperty(
                "article_img_url",
                expect.any(String)
              );
            });
            expect(articles.length).toBe(12);
            expect(articles).toBeSortedBy("created_at", { descending: true });
            expect(articles[0].comment_count).toBe(2);
          });
      });
    });

    describe("/api/articles/:article_id/comments", () => {
      test("200 GET: should return an array of comments, most recent first, filtered by given article id", () => {
        return request(app)
          .get("/api/articles/3/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            comments.forEach((comment) => {
              expect(comment).toHaveProperty("article_id", 3);
              expect(comment).toHaveProperty("comment_id", expect.any(Number));
              expect(comment).toHaveProperty("body", expect.any(String));
              expect(comment).toHaveProperty("votes", expect.any(Number));
              expect(comment).toHaveProperty("author", expect.any(String));
              expect(comment).toHaveProperty("created_at", expect.any(String));
            });
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("201 POST: should post a comment to the db and return the posted comment", () => {
        const comment = {
          username: "rogersop",
          body: "Generic comment section antics",
        };
        return request(app)
          .post("/api/articles/3/comments")
          .expect(201)
          .send(comment)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toHaveProperty("article_id", 3);
            expect(comment).toHaveProperty("author", "rogersop");
            expect(comment).toHaveProperty("body", "Generic comment section antics");
            expect(comment).toHaveProperty("comment_id", 19);
            expect(comment).toHaveProperty("votes", 0);
          });
      });
    });

    describe("/api/articles/:article_id", () => {
      test("200 GET: should respond with the correct article when given article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article).toHaveProperty("article_id", 1);
            expect(article).toHaveProperty(
              "title",
              "Living in the shadow of a great man"
            );
            expect(article).toHaveProperty("author", "butter_bridge");
            expect(article).toHaveProperty(
              "body",
              "I find this existence challenging"
            );
            expect(article).toHaveProperty(
              "created_at",
              "2020-07-09T20:11:00.000Z"
            );
            expect(article).toHaveProperty("votes", 100);
            expect(article).toHaveProperty(
              "article_img_url",
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            );
          });
      });
    });
  });

  describe("Error handling", () => {
    describe("/incorrect-address", () => {
      test("404: should respond with error message when user inputs incorrect address", () => {
        return request(app)
          .get("/incorrect-address")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Path not found");
          });
      });
    });

    describe("/api/articles/99", () => {
      test("404: should return message when user submits a request for a valid but non-existent record", () => {
        return request(app)
          .get("/api/articles/99")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No results found");
          });
      });
    });

    describe("/api/articles/sandwich", () => {
      test("400: should return message when user inputs an invalid request", () => {
        return request(app)
          .get("/api/articles/sandwich")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
    });

    describe("/api/articles/99/comments", () => {
      test("404: should return message when user requests comments from a non-existent article", () => {
        return request(app)
          .get("/api/articles/99/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No results found");
          });
      });
      test("400 POST: should return 'Article does not exist' message when user posts comment on a non-existent article", () => {
        const comment = {
          username: "rogersop",
          body: "Generic comment section antics",
        };
        return request(app)
          .post("/api/articles/99/comments")
          .expect(404)
          .send(comment)
          .then(({ body }) => {
            expect(body.msg).toBe("Article does not exist");
          });
      });
    });

    describe("/api/articles/sandwich/comments", () => {
      test("400: should return message when user inputs an invalid request", () => {
        return request(app)
          .get("/api/articles/sandwich/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
      test("400: should return message when user posts using an invalid path", () => {
        const comment = {
          username: "rogersop",
          body: "Generic comment section antics",
        };
        return request(app)
          .post("/api/articles/sandwich/comments")
          .expect(400)
          .send(comment)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
    });

    describe("/api/articles/:article_id/comments", () => {
      test("400 POST: should return 'Invalid input' message when posting an object with incomplete data", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({ })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("400 POST: should return 'Invalid input' message when posting an invalid data type", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send("{ }")
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("400 POST: should return message 'User not found' when provided an invalid username", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(404)
          .send({ username: "daryl69", body: "hello"})
          .then(({ body }) => {
            expect(body.msg).toBe("User does not exist");
          });
      });
      test("400 POST: should return 'Invalid input' message when present fields with invalid data type", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({ username: "rogersop", body: 123})
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
    });
  });
});
