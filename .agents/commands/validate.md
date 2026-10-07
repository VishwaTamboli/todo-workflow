---
description: Run all checks, fix failures, verify every acceptance criterion
agent: build
---

Validate the work for the plan in $ARGUMENTS.

Test results right now:

!`npm test 2>&1 | tail -40`

Smoke test right now:

!`npm run smoke 2>&1 | tail -10`

1. If anything failed:
   - find the root cause,
   - fix it,
   - re-run `npm test`,
   - re-run `npm run smoke`.

2. Make at most 3 attempts.

3. If the problem still exists after 3 attempts, stop and explain what is failing.

4. Read the plan.

5. For every acceptance criterion:
   - find the test that proves it,
   - if an acceptance criterion has no test, write one,
   - run `npm test` again.

6. End with a table:

| AC | Status | Evidence |
|---|---|---|
| Acceptance criterion | ✅ or ❌ | Test name or command output |

Say `VALIDATED` only if:

- every acceptance criterion is ✅
- `npm test` passes
- `npm run smoke` passes