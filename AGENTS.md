# AGENTS.md

## Cursor Cloud specific instructions

This is a personal portfolio site (tomasreimers.com) built with **Next.js 16**, **React Three Fiber** (3D starfield), and **SCSS modules**. It is a purely static frontend — no backend, no database, no API, no auth.

### Key commands

See `package.json` scripts:
- `yarn dev` — starts the Next.js dev server on port 3000
- `yarn build` — static export to `dist/`

### Caveats

- **Lint**: `yarn lint` invokes `next lint`, which was removed in Next.js 16. There is no standalone ESLint config file in the repo, so linting is effectively unavailable.
- **Tests**: No test framework or test scripts are configured.
- **Peer-dependency warnings**: `yarn install` emits many peer-dep warnings from `@react-three/*` packages (missing `three`, React 19 mismatch). These are harmless; the app builds and runs fine.
- **Static export**: `next.config.js` sets `output: "export"`, so `yarn start` (production SSR) won't work. Use `yarn dev` for development.
