---
description: Run all checks, fix failures, verify every acceptance criterion
agent: build
---

Validate the work for the plan in $ARGUMENTS.

Test results right now:
!`npm test 2>&1 | tail -40`

Smoke test right now:
!`npm run smoke 2>&1 | tail -10`

1. If anything failed: find the root cause, fix it, and re-run npm test and npm run smoke. At most 3 attempts, then stop and explain what still fails.
2. Read the plan. For every acceptance criterion, find the test that proves it.
3. If an acceptance criterion has no test, write one and re-run npm test.
4. End with a table: AC | ✅ or ❌ | evidence (test name or command output).

Say VALIDATED only if every AC is ✅ and all tests pass.