# Contributing to csd

## Setup

Requires Node (see [`.node-version`](.node-version)).

```bash
npm ci
```

## Commands

```bash
npm run dev            # serve the site locally, reloading on change
npm run build          # build the static site into build/
npm run preview        # serve the built site
npm run lint           # eslint, prettier, svelte-check
npm run format         # fix what can be fixed automatically
npm test               # run the tests once
npm run test:watch     # re-run the tests on change
npm run test:coverage  # run the tests with a coverage report
```

Run `npm run format` and then `npm run lint` before opening a pull request. CI
runs the same checks.

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages. The
repository's Pages source must be set to "GitHub Actions".

## Data

`data/boarddocs/` holds the district's Board Policy Manual exactly as
[BoardDocs](https://go.boarddocs.com/pa/ctsd/Board.nsf/Public) served it: every
active policy and Administrative Regulation, plus their attachments. It is the
source material, not part of the site. Pages link to BoardDocs for the text.
Don't edit these files by hand. They are a snapshot of what the district
published. When you replace the snapshot, set `boardDocsRetrievedOn` in
`data/source.json` to the date you took it. The site footer shows that date.

`data/policies/` has one JSON file per policy, holding the metadata the site
uses and the path to its raw HTML. These files are generated. After changing
anything in `data/boarddocs/`, run:

```bash
npm run extract:policies
```

`data/reports/` has one JSON file per report, notice, certification, or posting
that a policy requires. To add one, create a file named for its `id`. To
correct one, edit its file. Each report's `quote` must be the sentence from the
policy that creates the duty, copied exactly. `npm test` checks every quote
against the policy it cites.

## Conventions

- **No code comments.** Code should explain itself. If something seems to need
  a comment, give it a well-named helper function, constant, or variable
  instead. Reasoning that still needs saying goes in the commit message.
- **Named exports only.** No default exports, except where a tool requires
  one (such as `eslint.config.mjs` and `vitest.config.ts`).
- **Tests live in `__tests__` folders** beside the code they cover, and are
  named `*.test.ts`.
- **Formatting is Prettier's**, with tabs and double quotes from
  `.editorconfig`. Don't hand-format.

## Dependency constraints

- **TypeScript stays on 6.x** until `typescript-eslint` supports TypeScript 7.
- **`@types/node` follows `.node-version`**, not the latest release.

Dependabot is set to ignore major updates for both.
