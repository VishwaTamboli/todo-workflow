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

  describe("GET /todos/metrics", () => {
    it("returns zeroed metrics for an empty store", async () => {
      const response = await request(app).get("/todos/metrics");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 0,
        completed: 0,
        incomplete: 0,
        byPriority: { low: 0, medium: 0, high: 0 },
      });
    });
    it("reflects created todos and their priorities", async () => {
      await request(app).post("/todos").send({ title: "A", priority: "high" });
      const second = await request(app).post("/todos").send({ title: "B", priority: "low" });
      await request(app).patch(`/todos/${second.body.id}`).send({ completed: true });
      await request(app).post("/todos").send({ title: "C" });

      const response = await request(app).get("/todos/metrics");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 3,
        completed: 1,
        incomplete: 2,
        byPriority: { low: 1, medium: 1, high: 1 },
      });
    });

    it("reflects updates made via PATCH", async () => {
      const created = await request(app).post("/todos").send({ title: "Task" });
      await request(app)
        .patch(`/todos/${created.body.id}`)
        .send({ completed: true, priority: "high" });

      const response = await request(app).get("/todos/metrics");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total: 1,
        completed: 1,
        incomplete: 0,
        byPriority: { low: 0, medium: 0, high: 1 },
      });
    });

    it("does not conflict with GET /todos/:id", async () => {
      const created = await request(app).post("/todos").send({ title: "X" });

      const metrics = await request(app).get("/todos/metrics");
      const byId = await request(app).get(`/todos/${created.body.id}`);

      expect(metrics.status).toBe(200);
      expect(metrics.body).toHaveProperty("total");
      expect(byId.status).toBe(200);
      expect(byId.body.title).toBe("X");
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
