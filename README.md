# Todo Workflow

A simple Todo REST API project built with **Node.js, Express, Jest, and Supertest**.

This project also demonstrates an agent workflow using three custom OpenCode commands:

* `/plan`
* `/implement`
* `/validate`

## Plan → Implement → Validate

### 1. Plan

Command:

```text
/plan Add a priority field to todos
```

The planning workflow created:

```text
.agents/plans/todo-priority.md
```

The plan defined:

* Todo priority as `low`, `medium`, or `high`
* Default priority as `medium`
* Invalid priorities return HTTP `400`
* Required API tests
* Acceptance criteria

No source code was changed during planning.

### 2. Implement

Command:

```text
/implement .agents/plans/todo-priority.md
```

The implementation workflow:

* Read the complete plan
* Wrote tests first
* Implemented the Todo API
* Added priority support
* Ran the test suite

Result:

```text
1 suite passed
11 tests passed
0 failed
```

Files changed:

```text
src/app.js
src/todos.js
tests/todos.test.js
```

### 3. Validate

Command:

```text
/validate .agents/plans/todo-priority.md
```

The validation workflow:

* Ran `npm test`
* Ran the smoke test
* Checked every acceptance criterion
* Verified the API manually when the smoke script was not yet available
* Confirmed all requirements were satisfied

Final result:

```text
npm test
11 passed
0 failed
```

After adding the smoke test:

```text
npm run smoke
smoke test passed
```

## API Example

Create a Todo with high priority:

```bash
curl -X POST http://localhost:3000/todos \
-H "Content-Type: application/json" \
-d '{"title":"Learn OpenCode","priority":"high"}'
```

Response:

```json
{
  "id": 1,
  "title": "Learn OpenCode",
  "completed": false,
  "priority": "high"
}
```

Get all Todos:

```bash
curl http://localhost:3000/todos
```

## Workflow

```text
/plan
   ↓
Implementation Plan
   ↓
/implement
   ↓
Tests + Code
   ↓
/validate
   ↓
Tests + Smoke Test + Acceptance Criteria
   ↓
Validated
```

## Technologies

* Node.js
* Express
* Jest
* Supertest
* OpenCode
* Git
