const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpointJSON = require("../endpoints.json");

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
      test("200 GET: return results filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
            expect(articles).toHaveLength(11);
          });
      });
      test("200 GET: return results filtered by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            articles.forEach((article) => {
              expect(article.author).toBe("butter_bridge");
            });
            expect(articles).toHaveLength(3);
          });
      });
      test("200 GET: return results filtered by topic and author", () => {
        return request(app)
          .get("/api/articles?topic=mitch&author=rogersop")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            articles.forEach((article) => {
              expect(article.author).toBe("rogersop");
              expect(article.topic).toBe("mitch");
            });
            expect(articles).toHaveLength(2);
          });
      });
      test("200 GET: return results sorted by user-provided value", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("author", { descending: true });
          });
      });
      test("200 GET: return results ordered either descending or ascending", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("created_at", { descending: false });
          });
      });
      test("200 GET: successfully process multiple queries at the same time", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=title&order=asc")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy("title", { descending: false });
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
            expect(articles).toHaveLength(11);
          });
      });
      test("200 GET: return empty array if queried topic is valid but there are no matching articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toEqual([]);
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
            expect(comment).toHaveProperty(
              "body",
              "Generic comment section antics"
            );
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
            expect(article.article_id).toBe(1);
            expect(article.title).toBe("Living in the shadow of a great man");
            expect(article.author).toBe("butter_bridge");
            expect(article.body).toBe("I find this existence challenging");
            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
            expect(article.votes).toBe(100);
            expect(article.article_img_url).toBe(
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            );
          });
      });
      test("200 GET: when returning the requested article also return comment count of article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { article } = body;
            expect(article.comment_count).toBe(11);
          });
      });
      test("200 PATCH: should increment / decrement an articles vote count by given number and respond with updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 10 })
          .then(({ body }) => {
            const { article } = body;
            expect(article.article_id).toBe(1);
            expect(article.title).toBe("Living in the shadow of a great man");
            expect(article.author).toBe("butter_bridge");
            expect(article.body).toBe("I find this existence challenging");
            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
            expect(article.votes).toBe(110);
            expect(article.article_img_url).toBe(
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            );
          });
      });
    });

    describe("/api/users", () => {
      test("200 GET: should return an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            users.forEach((user) => {
              expect(user).toHaveProperty("username", expect.any(String));
              expect(user).toHaveProperty("name", expect.any(String));
              expect(user).toHaveProperty("avatar_url", expect.any(String));
            });
            expect(users.length).toBe(4);
          });
      });
    });

    describe("/api/users/:username", () => {
      test("200 GET: should return a user by user object", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            const { user } = body;
            expect(user.username).toBe("butter_bridge");
            expect(user.name).toBe("jonny");
            expect(user.avatar_url).toBe(
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
            );
          });
      });
    });

    describe("/api/comments/:comment_id", () => {
      test("204 DELETE: removes comment by provided comment id", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("200 PATCH: should increment / decrement comment vote count by given number and return comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(200)
          .send({ inc_votes: 10 })
          .then(({ body }) => {
            const { comment } = body;
            expect(comment.comment_id).toBe(1);
            expect(comment.body).toBe(
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
            expect(comment.votes).toBe(26);
            expect(comment.author).toBe("butter_bridge");
            expect(comment.article_id).toBe(9);
            expect(comment.created_at).toBe("2020-04-06T12:17:00.000Z");
          });
      });
    });

    describe("/api", () => {
      test("200 GET: should return JSON object of all endpoints on this API", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            const { endpoints } = body;
            expect(endpoints).toEqual(endpointJSON);
          });
      });
    });
  });

  describe("Error handling", () => {
    describe("/incorrect-address", () => {
      test("404 GET: should respond with error message when user inputs incorrect address", () => {
        return request(app)
          .get("/incorrect-address")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Path not found");
          });
      });
    });

    describe("/api/articles", () => {
      test("400 GET: should return 'Invalid sort query' when given non-existent field", () => {
        return request(app)
          .get("/api/articles?sort_by=tornado")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort query");
          });
      });
      test("400 GET: should return 'Invalid order query' when given input other than ASC or DESC", () => {
        return request(app)
          .get("/api/articles?order=backwards")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid order query");
          });
      });
      test("404 GET: should return 'Topic not found' message when given a non-existent topic", () => {
        return request(app)
          .get("/api/articles?topic=puppies")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic not found");
          });
      });
      test("404 GET: should return 'Author not found' message when given a non-existent topic", () => {
        return request(app)
          .get("/api/articles?author=christian")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Author not found");
          });
      });
    });

    describe("/api/articles/99", () => {
      test("404 GET: should return message when user submits a request for a valid but non-existent article", () => {
        return request(app)
          .get("/api/articles/99")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
    });

    describe("/api/articles/sandwich", () => {
      test("400 GET: should return message when user inputs an invalid request", () => {
        return request(app)
          .get("/api/articles/sandwich")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
      test("400 PATCH: should return message when user updates to an invalid path", () => {
        return request(app)
          .patch("/api/articles/sandwich")
          .expect(400)
          .send({ inc_votes: 10 })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
    });

    describe("/api/articles/99/comments", () => {
      test("404 GET: should return message when user requests comments from a non-existent article", () => {
        return request(app)
          .get("/api/articles/99/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
      test("400 POST: should return 'Article not found' message when user posts comment on a non-existent article", () => {
        const comment = {
          username: "rogersop",
          body: "Generic comment section antics",
        };
        return request(app)
          .post("/api/articles/99/comments")
          .expect(404)
          .send(comment)
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
    });

    describe("/api/articles/sandwich/comments", () => {
      test("400 GET: should return message when user inputs an invalid request", () => {
        return request(app)
          .get("/api/articles/sandwich/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
      test("400 POST: should return message when user posts using an invalid path", () => {
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
          .send({})
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
      test("404 POST: should return message 'User not found' when provided an invalid username", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(404)
          .send({ username: "daryl69", body: "hello" })
          .then(({ body }) => {
            expect(body.msg).toBe("User not found");
          });
      });
      test("400 POST: should return 'Invalid input' message when present fields with invalid data type", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({ username: "rogersop", body: 123 })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
    });
    describe("/api/articles/:article_id", () => {
      test("400 PATCH: should return 'Invalid input' message when posting an object with incomplete data", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("400 PATCH: should return 'Invalid input' message when posting an invalid data type", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .send({ some_random_key: 83 })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("400 PATCH: should return 'Invalid input' message when object has invalid data type", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .send({ inc_vote: "rogersop" })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("404 PATCH: should return 'Article not found' message when user updates non-existent article", () => {
        return request(app)
          .patch("/api/articles/99")
          .expect(404)
          .send({ inc_votes: 10 })
          .then(({ body }) => {
            expect(body.msg).toBe("Article not found");
          });
      });
    });

    describe("/api/users/:username", () => {
      test("404 GET: should return 'User not found' when requesting a valid but non-existent user", () => {
        return request(app)
          .get("/api/users/dave-mcfiggins")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User not found");
          });
      });
    });

    describe("/api/comments/:comment_id", () => {
      test("404 DELETE: return 'Comment not found' when given a comment which does not exist", () => {
        return request(app)
          .delete("/api/comments/123")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment not found");
          });
      });
      test("400 DELETE: return 'Invalid request' when given an id that's NaN", () => {
        return request(app)
          .delete("/api/comments/all")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
      test("404 PATCH: return 'Comment not found' when given a comment which does not exist", () => {
        return request(app)
          .patch("/api/comments/123")
          .expect(404)
          .send({ inc_vote: 3 })
          .then(({ body }) => {
            expect(body.msg).toBe("Comment not found");
          });
      });
      test("400 PATCH: return 'Invalid request' when given an id that's NaN", () => {
        return request(app)
          .patch("/api/comments/all")
          .expect(400)
          .send({ inc_vote: 3 })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid request");
          });
      });
      test("400 PATCH: return 'Invalid input' message when passed an object with incomplete data", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("400 PATCH: return 'Invalid input' message when pass an object with invalid keys", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(400)
          .send({ some_random_key: 76 })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
      test("400 PATCH: return 'Invalid input' message when passed an object of invalid data type", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(400)
          .send({ inc_vote: true })
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
    });
  });
});
