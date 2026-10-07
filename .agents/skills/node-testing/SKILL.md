# Node Testing Skill

## Purpose

Define how tests should be written for this Node.js project.

## Testing Stack

Use:

- Jest
- Supertest

## Rules

1. Write tests before implementation.
2. Test API behavior rather than internal implementation details.
3. Test successful requests.
4. Test important error cases.
5. Verify HTTP status codes.
6. Verify response bodies.
7. Keep tests small and focused.

## API Test Pattern

For an endpoint, test:

- HTTP method
- URL
- request body or query parameters
- HTTP status
- response JSON

Example structure:

```js
describe("GET /books", () => {
  it("returns all books", async () => {
    const response = await request(app)
      .get("/books");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });
});