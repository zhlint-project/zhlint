# Contribution guide

## How to start

(wip)

## Workflow

(wip)

## Project setup

### Commands

Dev and debug

- `dev`
- `dev:ui`

Build

- `build`
  - `build:js`
    - `build:node`
    - `build:browser`
  - `build:type`

Lint and test

- `format`
- `lint`
- `test`
- `coverage`

Docs

- `docs`
- `docs:build`
- `docs:serve`
- `docs:deploy`

### Output

- Bin: `./bin/index.js` (CJS)
- Node.js: `./lib/index.js` (CJS)
- Unkpg/Jsdelivr: `./dist/zhlint.umd.js` (UMD)
- Type defs: `./dist/zhlint.d.ts`
- Published files:
  - `bin/`, `lib/`, `dist/`
  - `tsconfig.json`
  - `docs/*.{svg,png}`, `README.md`

### File structure

Temp

- `temp/`
- `TODO`

Git/GitHub related

- `.github/`
- `.gitignore`

Code

- `bin/`
- `src/`
- `lib/` (ignored)
- `dist/` (ignored)

Types

- `types/`?
- `api-extractor.json`

Docs

- `docs/`
- `docs/.vitepress/`
- `deploy.sh`

Tests

- `test/`
- `./stdout.log`
- `./stderr.log`

Package info

- `package.json`
- `pnpm-lock.yaml`
- `node_modules/` (ignored)

Build config

- `tsconfig-build.json`
- `tsconfig.json`
- `vite.config.js`

Linting

- `.eslintrc.json`
- `.prettierignore`
- `.prettierrc.json`

Basic info

- `LICENSE`
- `README.md`
- `README.zh-CN.md`
