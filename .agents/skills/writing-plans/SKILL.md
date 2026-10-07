# Writing Plans Skill

## Purpose

Create a clear implementation plan before code is changed.

## Process

Before writing the plan:

1. Understand the requested feature.
2. Inspect the existing project structure.
3. Read the files that will be affected.
4. Understand the existing API behavior.
5. Identify what tests are needed.

## Plan Requirements

The plan must include:

### Goal

Clearly explain what feature will be added.

### Files to Change

List every existing file that needs modification.

### Files to Create

List every new file that needs to be created.

### Implementation Tasks

Break the work into small ordered tasks.

Each task should explain:

- what needs to change,
- which file is involved,
- how the change should work,
- what test should verify it.

### Acceptance Criteria

Every feature requirement must have a clear acceptance criterion.

Example:

- `GET /books/search?title=clean` returns books matching the title.
- Searching with no matching books returns an empty array.
- The endpoint returns HTTP 200.

## Important

Do not write code in the plan.

The plan should contain enough information for another developer or agent to implement the feature without guessing.