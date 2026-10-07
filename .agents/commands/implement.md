---
description: Implement a plan file task by task, tests first
agent: build
---

Implement the plan in $ARGUMENTS.

1. Read the whole plan, then read every file it mentions.

2. Do the tasks in order.

3. For each task:
   - write the tests first using the node-testing skill,
   - then write the implementation,
   - use the api-conventions skill for API endpoints,
   - run `npm test`,
   - fix failures before starting the next task.

4. Follow AGENTS.md.

5. Do only what the plan asks.

6. Don't edit the plan.

7. If the plan is wrong or unclear, stop and explain why.

Finish with:

- files changed
- tests added
- last `npm test` summary