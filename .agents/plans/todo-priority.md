# Plan: Add a Priority Field to Todos

## Goal

Add a `priority` field to todos so each todo can carry one of a fixed set of
priority levels. Note: the repo currently has **no todo implementation** —
`src/todos.js` and `src/app.js` are empty and `tests/todos.test.js` only
contains a placeholder test. This plan therefore creates the minimal in-memory
todo API needed, with `priority` supported from the start, instead of
modifying a non-existent existing structure.

## Current State

- `src/app.js` — empty
- `src/todos.js` — empty
- `tests/todos.test.js` — placeholder test only (`expect(true).toBe(true)`)
- No existing endpoints, models, or data.

## Files to Change

- `src/app.js` — create the Express app, mount todo routes, export the app.
- `src/todos.js` — create the in-memory todo store and route handlers.
- `tests/todos.test.js` — replace the placeholder test with real API tests.

## Files to Create

None beyond filling in the files above (a plan directory entry at
`.agents/plans/todo-priority.md`).

## Priority Field Spec

- Field name: `priority`
- Allowed values: `"low"`, `"medium"`, `"high"`
- Default: `"medium"` when the client omits `priority` on create.
- Invalid values (e.g. `"urgent"`, non-strings) are rejected with HTTP 400
  and a JSON error body.

## Data Shape

```json
{ "id": 1, "title": "Buy milk", "completed": false, "priority": "medium" }
```

## Implementation Tasks

### Task 1: App scaffolding

- In `src/app.js`, create an Express app, `express.json()` middleware,
  mount the todo router at `/todos`, and export the app without listening.
- In `src/todos.js`, create an Express Router, an in-memory array store,
  and a numeric id counter.
- Test (`tests/todos.test.js`): `GET /todos` returns HTTP 200 and an empty
  array initially.

### Task 2: Create todos with priority

- Add `POST /todos` accepting `{ "title", "priority?" }`.
- Title is required; missing/empty title returns HTTP 400 with a JSON error.
- `priority` defaults to `"medium"`; invalid values return HTTP 400.
- Successful create returns HTTP 201 and the created todo including
  `id`, `title`, `completed: false`, and `priority`.
- Tests: default priority is `"medium"`; explicit valid priority is stored;
  invalid priority returns 400; missing title returns 400.

### Task 3: Read todos

- `GET /todos` returns all todos (HTTP 200).
- `GET /todos/:id` returns one todo (HTTP 200) or 404 with a JSON error
  when the id does not exist.
- Tests: list contains created todos; fetch by id returns the todo with its
  priority; unknown id returns 404.

### Task 4: Update priority

- Add `PATCH /todos/:id` accepting `{ "priority?", "title?", "completed?" }`.
- Unknown id returns HTTP 404; invalid priority returns HTTP 400.
- Successful update returns HTTP 200 with the updated todo.
- Tests: priority can be changed; invalid priority returns 400; unknown id
  returns 404.

## Acceptance Criteria

- `POST /todos` with `{ "title": "x" }` returns 201 and
  `priority: "medium"`.
- `POST /todos` with `{ "title": "x", "priority": "high" }` returns 201
  and `priority: "high"`.
- `POST /todos` with an invalid priority returns HTTP 400.
- `GET /todos/:id` returns the todo including its priority.
- `PATCH /todos/:id` with a valid priority updates it and returns 200.
- `PATCH /todos/:id` with an invalid priority returns HTTP 400.
- All error responses are JSON with an `error` message.
- `npm test` passes.
