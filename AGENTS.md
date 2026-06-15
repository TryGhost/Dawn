# AGENTS.md

## Scope

This package is the Dawn Ghost theme. In the standalone mirror repository, this tree is pushed from `TryGhost/Themes/packages/dawn` by subtree sync; make durable theme-content changes in `TryGhost/Themes` unless the task is explicitly repo-level metadata or GitHub settings.

## Commands

Use pnpm, pinned by `package.json`.

```bash
pnpm install
pnpm dev
pnpm test
pnpm zip
```

From the `TryGhost/Themes` monorepo root, validate this package with:

```bash
pnpm test:ci --theme dawn
```

## Boundaries

- Edit source CSS in `assets/css/`, source JavaScript in `assets/js/`, and templates/partials as `.hbs` files.
- Keep generated `assets/built/` files in sync when source assets change.
- Do not commit `node_modules/`, secrets, or local Ghost content.
- Translation changes normally belong in `TryGhost/Themes/packages/theme-translations`; package-local locale overrides should be intentional and rebuilt.
