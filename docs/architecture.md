# Architecture

This project keeps the Snake rules separate from React so gameplay behavior can
be tested deterministically and reused if the UI changes later.

## Layers

### Pure Game Logic

`src/game/` owns the game rules:

- `constants.ts` defines board size, speed, initial direction, and initial snake
  positions.
- `types.ts` defines `Direction`, `GameStatus`, `Position`, and `GameState`.
- `movement.ts` computes next positions, opposite directions, bounds checks, and
  position equality.
- `food.ts` finds available cells and places food with an injectable random
  function.
- `engine.ts` creates game state and handles start, pause, resume, direction
  queueing, collisions, scoring, growth, win detection, and ticks.

This layer should stay free of React, DOM APIs, browser events, timers, and
rendering concerns.

### React Hook

`src/hooks/useSnakeGame.ts` is the bridge between pure rules and the UI. It owns:

- React state for the current `GameState`.
- The interval-driven game loop while the game is running.
- Keyboard controls for arrows, `W`, `A`, `S`, `D`, and `Space`.
- Public callbacks for starting, pausing, resuming, restarting, and changing
  direction from UI controls.

The hook should delegate game rules to `src/game/engine.ts` instead of
duplicating movement, collision, scoring, or food-placement logic.

### UI Components

`src/components/` renders the current state and sends user intent back to the
hook:

- `GameBoard` renders the board, food, snake body, snake head, and terminal
  overlays.
- `Controls` renders direction buttons and the primary action button.
- `ScoreBoard` renders score and status text.

Components should stay presentational, accessible, and easy to test with
rendered output.

### App Composition

`src/App.tsx` wires the hook into `ScoreBoard`, `GameBoard`, and `Controls`.
`src/index.tsx` bootstraps React through Vite.

### Shared Types

`src/types.ts` re-exports public game types from `src/game/types.ts` for imports
outside the game layer. Add new shared types to the game layer first when they
describe game state or rules.

## Data Flow

1. UI or keyboard input calls a hook action.
2. The hook updates React state by calling pure engine functions.
3. While running, the hook schedules ticks at `GAME_SPEED`.
4. Each tick computes the next state in the engine.
5. React re-renders the presentational components with the new state.

Food placement accepts an injected `random` function in the pure layer so tests
can avoid real randomness and cover edge cases such as full-board wins.

## Change Guidance

- Add gameplay behavior in `src/game` first, then expose it through
  `useSnakeGame` only when the UI needs it.
- Keep timer and keyboard side effects in the hook.
- Keep rendering and accessibility details in components.
- Update `docs/testing.md` when new gameplay behavior needs specific test
  guidance.
- Consider extracting a reusable engine only after there is a concrete second
  consumer or enough complexity to justify the additional API surface.
