

---
description: Implement a plan file task by task, tests first
agent: build
---

Implement the plan in $ARGUMENTS.

1. Read the whole plan, then read every file it mentions.
2. Do the tasks in order. For each task:
   - write the tests first (use the node-testing skill),
   - then write the code (use the api-conventions skill for endpoints),
   - run npm test and fix failures before starting the next task.
3. Follow AGENTS.md. Do only what the plan asks.
4. Don't edit the plan. If it is wrong or unclear, stop and explain why.

Finish with: files changed, tests added, and the last npm test summary.