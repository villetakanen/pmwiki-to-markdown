## Project Context
This project converts PmWiki markup to Markdown format. The conversion pipeline processes Wikitext through multiple stages, handling elements like images, links, formatting, and wiki-specific syntax.

## Development Guidelines

### Package Management
- **ALWAYS use `pnpm`** for all package management and script execution
- Never suggest `npm` or `yarn` commands

### Testing Protocol
- Use package.json scripts for testing when available
- For interactive test runners, prefix with `echo q |` to avoid prompts
- Place manual testing utilities in `test/manual/` directory only

**Examples:**
```bash
# Run specific test file
echo q | pnpm test test/debug-horizontal-rules.test.ts

# Run all tests
echo q | pnpm test

# Development server
pnpm dev
```

### Code Style & Architecture
- Follow the existing conversion pipeline structure
- Maintain the order of operations in transformation steps
- When modifying conversion logic, consider impact on:
  - Inline style application
  - Wiki marker cleanup
  - User tag conversion
  - Link and image processing

### Debugging Conversion Issues
1. Identify which pipeline stage is affected
2. Check the order of transformations
3. Verify inline style interactions with other formatting
4. Test with minimal examples first
5. Use manual test files in `test/manual/` for complex scenarios

### File Organization
- Conversion logic: Focus on pipeline order and transformations
- Tests: Use existing test structure and naming conventions
- Manual tests: Always place in `test/manual/` directory

## Response Format
- Provide specific file paths for code changes
- Use TypeScript/JavaScript syntax for this project
- Reference existing functions and patterns when suggesting modifications
