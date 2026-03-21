## Cursor Cloud specific instructions

### Overview

This is a single-page personal portfolio website (tomasreimers.com) built with **Next.js 16** (App Router, static export), **React 18**, **Three.js** (3D starfield background), and **SCSS Modules**. There is no backend, database, or API — it is a fully static site.

### Package manager

Uses **Yarn (v1 classic)** — the lockfile is `yarn.lock`.

### Running the dev server

```
yarn dev
```
Starts the Next.js dev server on `http://localhost:3000`.

### Building

```
yarn build
```
Produces a static export in the `dist/` directory.

### Linting

The `yarn lint` script calls `next lint`, which was **removed in Next.js 16**. There is no standalone ESLint config file (`.eslintrc*` / `eslint.config.*`), so ESLint cannot run independently either. Lint is effectively not available until a config is added or the project migrates to a supported linting setup.

### Tests

No test framework or test scripts are configured.

### Caveats

- Peer dependency warnings during `yarn install` about React 19 / Three.js versions are expected and harmless — the site uses React 18 with newer `@react-three/*` packages.
- The 3D starfield background uses WebGL via `@react-three/fiber`. In headless or GPU-less environments, the canvas renders but stars may not animate.
