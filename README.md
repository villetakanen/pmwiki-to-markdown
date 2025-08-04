# pmwiki-to-markdown
A Typescript based converter from PmWiki format to markdown with headmeatter

## Usage
```bash
pnpm install -g pmwiki-to-markdown
pmwiki-to-markdown -i <input> -o <output>
```

## Development Scripts

The following npm/pnpm scripts are available for development:

- **`pnpm build`** - Compiles TypeScript and builds the project with Vite
- **`pnpm start`** - Runs the compiled application from `dist/index.js`
- **`pnpm check`** - Runs Biome linter/formatter with auto-fix
- **`pnpm test`** - Runs the test suite with Vitest
- **`pnpm test-run`** - Builds the project and runs it against test materials (converts files from `test-materials` to `test-results`) 