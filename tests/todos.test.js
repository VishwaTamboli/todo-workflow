const request = require("supertest");
const app = require("../src/app");
const todosRouter = require("../src/todos");

beforeEach(() => {
  todosRouter._reset();
});

describe("Todo API", () => {
  describe("GET /todos", () => {
    it("returns all todos", async () => {
      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /todos", () => {
    it("creates a todo with default priority medium", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "Buy milk" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: "Buy milk",
        completed: false,
        priority: "medium",
      });
    });

    it("stores an explicit valid priority", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "Fix bug", priority: "high" });

      expect(response.status).toBe(201);
      expect(response.body.priority).toBe("high");
    });

    it("rejects an invalid priority", async () => {
      const response = await request(app)
        .post("/todos")
        .send({ title: "Fix bug", priority: "urgent" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: expect.any(String) });
    });

    it("rejects a missing title", async () => {
      const response = await request(app).post("/todos").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: expect.any(String) });
    });
  });

  describe("GET /todos/:id", () => {
    it("returns the todo with its priority", async () => {
      const created = await request(app)
        .post("/todos")
        .send({ title: "Read book", priority: "low" });

      const response = await request(app).get(`/todos/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: created.body.id,
        title: "Read book",
        priority: "low",
      });
    });

    it("returns 404 for an unknown id", async () => {
      const response = await request(app).get("/todos/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: expect.any(String) });
    });
  });

  describe("PATCH /todos/:id", () => {
    it("updates the priority", async () => {
      const created = await request(app).post("/todos").send({ title: "Task" });

      const response = await request(app)
        .patch(`/todos/${created.body.id}`)
        .send({ priority: "high" });

      expect(response.status).toBe(200);
      expect(response.body.priority).toBe("high");
    });

    it("rejects an invalid priority", async () => {
      const created = await request(app).post("/todos").send({ title: "Task" });

      const response = await request(app)
        .patch(`/todos/${created.body.id}`)
        .send({ priority: "urgent" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: expect.any(String) });
    });

    it("returns 404 for an unknown id", async () => {
      const response = await request(app)
        .patch("/todos/999")
        .send({ priority: "low" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: expect.any(String) });
    });
  });

  describe("GET /todos", () => {
    it("lists created todos", async () => {
      await request(app).post("/todos").send({ title: "One" });
      await request(app).post("/todos").send({ title: "Two", priority: "high" });

      const response = await request(app).get("/todos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[1].priority).toBe("high");
    });
  });
});
