# Agent Guide for csd

This document provides context for LLM agents contributing to the `csd`
repository. Read [CONTRIBUTORS.md](CONTRIBUTORS.md) first: its setup, commands,
and conventions apply to agents exactly as they do to people.

## Project Overview

`csd` is an unofficial collection of tools and resources about the Cheltenham
Township School District. It is not affiliated with the district, and nothing
here should read as though it were: the district's own words live on BoardDocs,
and anything this project says about them is a reading of them.

**Key Technologies:**

- Node.js (see `.node-version` for the current version) with TypeScript
- ESM throughout — `package.json` sets `"type": "module"`
- SvelteKit with `@sveltejs/adapter-static`, prerendering every page
- ESLint (flat config) with `@biffud/eslint-config` and `eslint-plugin-svelte`
- Prettier for formatting, with `prettier-plugin-svelte`
- Vitest for tests

## The Site

The site is a fully static SvelteKit build. SvelteKit 3 has no
`svelte.config.js`: its configuration is passed to the `sveltekit()` plugin in
`vite.config.ts`. `src/routes/+layout.ts` turns on prerendering for every
route, so anything a page shows has to be available at build time. There is no
server to ask later.

GitHub Pages serves the site from `/<repository>`, not from the root. The
deploy workflow passes that prefix to the build as `BASE_PATH`, which becomes
`paths.base`. Links inside the site go through `resolve()` from `$app/paths`
so they carry the prefix. A hard-coded `/` path works under `npm run dev` and
breaks once deployed.

`tsconfig.json` extends `$app/tsconfig`, which `svelte-kit sync` generates
into `node_modules`. The `prepare` script runs that on install. If type
checking complains that the config cannot be found, run `npx svelte-kit sync`.

## After Making Changes

**Always run the formatter and linter after making ANY changes, including
documentation, configuration, and JSON files:**

```bash
npm run format
npm run lint
```

## Code Conventions

Beyond those in CONTRIBUTORS.md:

1. **No magic numbers** — pull them out into named constants.
2. **Import ordering** — builtin, external, internal, parent, sibling, index,
   object, type. No blank lines between groups. Nothing lints for this.
3. **Explicit return types** — required for all functions (except test files).
4. **Type-only imports** — `verbatimModuleSyntax` is on, so type-only imports
   must use `import type`.
5. **`erasableSyntaxOnly` is on** — no `enum`, no parameter properties, no
   namespaces with runtime output. Use `const` objects with `as const` and
   union types in place of enums.

### Testing

**Fixtures belong to the suite that uses them**, in a `fixtures/` directory
inside that `__tests__` folder. **`src/test/` holds tooling** — helpers and
factories shared across suites, not fixtures.

Import the helpers explicitly — `import { describe, expect, it } from "vitest"`.
Globals are deliberately off.

`vitest.config.ts` sets `passWithNoTests`, so an empty suite passes. Take it out
when the first suite lands, or a mistake in `include` will pass silently.

### Formatting

`.prettierrc.json` only loads `prettier-plugin-svelte`. Prettier otherwise runs
on its defaults, shifted only by `.editorconfig` (`indent_style = tab`). Adding
a style option there is a deliberate decision, not a cleanup — it would
reformat every file.

## Version Constraints

- **TypeScript stays on 6.x.** `typescript-eslint` does not support TypeScript
  7 yet. Verify the upstream peer range before lifting this.
- **`@types/node` tracks `.node-version`**, not the latest release.
- **ESLint moves with `@biffud/eslint-config`.** The config's major version is
  the ESLint major it supports, and it is on a `~` range because its minor
  releases are the ones that change rules.

## CI

`.github/workflows/ci.yml` runs on pushes to `main` and on pull requests, with
one job apiece for:

- `actionlint` — workflow file validity
- `npm-install` — verifies `package-lock.json` is in sync with `package.json`
- `eslint`, `prettier`, `svelte-check` — the three parts of `npm run lint`
- `test` — runs `npm run test:coverage`
- `build` — verifies the static site builds

`.github/workflows/deploy.yml` runs on pushes to `main`. It builds the site with
the Pages base path and publishes `build/` to GitHub Pages.

## Maintaining This Document

Keep this document current as the codebase evolves. Update it when new
patterns or conventions are established, the project structure changes, new
npm scripts or CI jobs are added, or version constraints are lifted or added.

- Keep the document user-agnostic (no local paths or developer-specific
  references).
- Reference version files (`.node-version`, `package.json`) rather than
  hardcoding versions.
- Remove outdated information rather than letting it accumulate.
- Do not record project status here; that belongs in issues.
