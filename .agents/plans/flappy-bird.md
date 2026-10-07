# Plan: Flappy Bird-Style Browser Game

## Goal

Add a simple Flappy Bird-style game as a standalone HTML file, in the
same spirit as the existing `game.html` (Snake). The bird falls with
gravity, flaps on Space/click/tap, pipes scroll right-to-left with
random gaps, scoring on passing pipes, game over on pipe/ground/ ceiling
collision, and a restart option. No new dependencies.

## Current State

- `game.html` — a standalone Snake game using inline `<script>` and
  `<canvas>`, no build step, no dependencies.
- `src/`, `tests/`, `scripts/` — Express todo API with Jest/Supertest.
  The game does not touch this code.

## Files to Change

None.

## Files to Create

- `flappy.html` — the complete game: markup, styles, and inline game
  script (same self-contained style as `game.html`).

## Game Spec

- Canvas-based game, responsive: canvas scales to fit the window while
  keeping a fixed logical size (e.g. 400x600).
- Bird: small rectangle/circle near the left third of the screen;
  gravity accelerates it downward each frame; Space keydown, mouse
  click, or touchstart sets an upward velocity (one flap each).
- Pipes: pairs of green rectangles spawn from the right at a fixed
  interval and move left at constant speed. Each pair has a vertical
  gap of fixed height (e.g. 140px) positioned at a random y.
- Scoring: +1 when the bird's x passes a pipe pair's x without
  collision; score shown on screen.
- Collision: bird vs. any pipe rectangle, ground (bottom of canvas),
  or top of canvas ends the game.
- Game over: overlay text with final score and "Press Space / tap to
  restart"; restarting resets bird, pipes, score, and state.
- States: ready (waiting for first input), playing, game over.

## Implementation Tasks

### Task 1: Scaffolding and canvas

- Create `flappy.html` with the same structure as `game.html`:
  `<canvas>`, inline styles, inline `<script>`, score display.
- Add a fixed logical canvas size and CSS scaling so it fits desktop
  and mobile (`max-width`/`max-height` with aspect preserved).
- Test (manual): opening the file shows a blank game area and "0" score.

### Task 2: Bird physics and input

- Implement bird position/velocity, gravity each frame, and an upward
  impulse on Space, click, or touch.
- Clamp nothing yet — let the bird fall; draw it each frame.
- Test (manual): Space/click/tap makes the bird jump; it falls back
  between inputs.

### Task 3: Pipes

- Spawn pipe pairs on a timer/interval off the right edge; each pair
  has a random gap position within a safe margin.
- Move all pipes left by a constant speed each frame; remove pipes once
  fully off screen.
- Test (manual): pipes scroll smoothly, gaps vary, pipes disappear off
  the left edge.

### Task 4: Collision and game over

- Detect collision between the bird and each pipe rectangle, the ground,
  and the top of the canvas.
- On collision, set state to game over: stop spawning/moving gameplay,
  draw "Game Over" with the final score and restart hint.
- Test (manual): hitting a pipe, ground, or ceiling shows game over.

### Task 5: Scoring and restart

- Increment score when the bird passes a pipe pair (bird.x > pair.x +
  pair width, once per pair) and update the on-screen score.
- On Space/click/tap in game-over state, reset bird, pipes, score, and
  state back to a ready/playing state.
- Test (manual): score increments through gaps; restart resets everything.

## Testing Strategy

- The repo's Jest/Supertest setup targets the Express API and is not
  applied to standalone HTML files, so this feature uses manual
  verification in the browser on desktop and mobile viewports.
- Verify: flap controls on keyboard, mouse, and touch; smooth pipe
  movement and random gaps; collisions on pipe/ground/ceiling; score
  increments on passing pairs; game-over screen shows final score;
  restart works.
- `npm test` and `npm run smoke` for the existing API must still pass
  (no changes expected since todo code is untouched).

## Acceptance Criteria

- `flappy.html` opens in a browser with no server and no dependencies.
- Bird falls continuously due to gravity.
- Space, click, or tap flaps the bird upward.
- Pipes move right-to-left at constant speed with random gap positions.
- Score increases by 1 each time the bird passes a pipe pair.
- Hitting a pipe, the ground, or the top of the screen ends the game.
- Game-over screen shows the final score and a restart option (Space /
  click / tap).
- Layout works on desktop and mobile screen sizes.
- No changes to `src/`, `tests/`, `scripts/`, or `package.json`.
- `npm test` still passes.
