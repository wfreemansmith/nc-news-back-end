const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("app", () => {
  describe("/api/topics", () => {
    describe("Successful requests", () => {
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
    describe("Error handling", () => {
      test("should respond with error message when user inputs incorrect address", () => {
        return request(app)
          .get("/api/incorrect-address")
          .expect(404)
          .then((response) => {
            expect(response.status).toBe(404);
          });
      });
    });
  });
});
