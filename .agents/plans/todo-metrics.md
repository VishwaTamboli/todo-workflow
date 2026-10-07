# Plan: Add a Metrics Endpoint for Todos

## Goal

Add a read-only metrics endpoint for the todo API that summarizes the
current in-memory todo data: totals, completion counts, and counts broken
down by priority.

## Current State

- `src/app.js` — creates the Express app, mounts `src/todos.js` at `/todos`.
- `src/todos.js` — in-memory todo store with `GET /`, `GET /:id`,
  `POST /`, `PATCH /:id`.
- `tests/todos.test.js` — Supertest/Jest API tests with `_reset()` in
  `beforeEach`.
- `scripts/smoke.js` — basic smoke check that must keep passing.

## Files to Change

- `src/todos.js` — add the metrics route.
- `tests/todos.test.js` — add tests for the new endpoint.

## Files to Create

None.

## Metrics Spec

- Endpoint: `GET /todos/metrics` (no request body).
- Response (HTTP 200, JSON):

```json
{
  "total": 3,
  "completed": 1,
  "incomplete": 2,
  "byPriority": { "low": 1, "medium": 1, "high": 1 }
}
```

- `total` — number of todos.
- `completed` — number of todos with `completed: true`.
- `incomplete` — number of todos with `completed: false`.
- `byPriority` — counts per priority level; every allowed level
  (`low`, `medium`, `high`) is present even when its count is 0.
- With no todos, all counts are 0 and every `byPriority` key is 0.
- The route must be registered **before** `GET /todos/:id` so the
  path segment `metrics` is not captured by `:id`.
- The metrics always reflect the current in-memory store and require no
  query parameters.

## Implementation Tasks

### Task 1: Metrics endpoint returns zeroed metrics for an empty store

- In `src/todos.js`, register `GET /metrics` before `GET /:id`.
- Compute counts from the in-memory `todos` array and return the shape
  described in the Metrics Spec.
- Test: `GET /todos/metrics` returns HTTP 200 and
  `{ total: 0, completed: 0, incomplete: 0, byPriority: { low: 0, medium: 0, high: 0 } }`.

### Task 2: Metrics reflect created todos and their priorities

- Extend the handler to count `completed` vs `incomplete` and bucket by
  `priority` using the allowed priority list (missing/unknown priorities
  cannot occur, but default to counting actual values only).
- Test: after creating todos (e.g. one completed high, one incomplete low,
  one incomplete medium), `GET /todos/metrics` returns the matching counts
  with HTTP 200.

### Task 3: Metrics update after patches

- No handler change needed beyond Task 2; verify that toggling `completed`
  or changing `priority` via `PATCH /todos/:id` is reflected in the next
  `GET /todos/metrics` call.
- Test: after `PATCH` sets `completed: true` and changes priority, the
  metrics endpoint shows updated `completed`, `incomplete`, and
  `byPriority` values.

## Acceptance Criteria

- `GET /todos/metrics` with no todos returns HTTP 200 and all counts 0,
  with every `byPriority` key present and 0.
- `GET /todos/metrics` returns correct `total`, `completed`, `incomplete`,
  and per-priority counts after creating todos.
- Metrics reflect updates made via `PATCH /todos/:id` (completion and
  priority changes).
- `GET /todos/metrics` does not conflict with `GET /todos/:id` (e.g.
  requesting `/todos/metrics` does not return 404 "todo not found", and
  `GET /todos/:id` still works).
- Response body is JSON with the exact keys described above.
- `npm test` passes.
- `npm run smoke` passes.
