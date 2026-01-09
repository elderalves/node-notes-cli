# GitHub Copilot Instructions

## Project Overview

This is a Node.js CLI application that provides a simple note-taking interface. The application allows users to add, list, read, and remove notes via command-line interface using yargs for argument parsing. Notes are stored in a JSON file (`notes-data.json`).

## Code Style and Formatting

- **ESLint**: Code must pass ESLint checks with the configured rules
  - Extends `plugin:prettier/recommended`
  - ES2017 syntax (ECMAScript version 2017)
- **Prettier**: All code should be formatted with Prettier
  - Configuration defined in `.prettierrc`
- **String Quotes**: Use double quotes for strings (as seen throughout the codebase)
- **Variable Declaration**: Use `const` for immutable values, `let` for mutable values, avoid `var` except in legacy code
- **Arrow Functions**: Use arrow functions for callbacks and short functions

## Commit Message Conventions

This project follows **Conventional Commits** enforced by commitlint:

- **Format**: `<type>(<scope>): <subject>`
- **Types**: feat, fix, docs, style, refactor, perf, test, chore, revert
- **Scope**: lowercase, optional
- **Subject**: required, cannot be empty

Examples:
- `feat: add new command for searching notes`
- `fix(notes): correct duplicate note detection`
- `docs: update README with new examples`
- `chore: update dependencies`

## Project Structure

```
.
├── app.js                 # Main application entry point (CLI command router)
├── notes.js               # Core notes module (CRUD operations)
├── helpers/
│   └── argDocs.js         # Yargs command configuration
├── notes-data.json        # JSON file for storing notes
├── package.json           # Node.js project configuration
├── .eslintrc              # ESLint configuration
├── .prettierrc            # Prettier configuration
├── commitlint.config.js   # Commitlint configuration
└── .husky/                # Git hooks configuration
```

## Key Components

### app.js
- Entry point for the CLI application
- Uses switch statement to route commands: add, list, read, remove
- Imports and uses the notes module for operations

### notes.js
- Core module with functions: `addNote`, `getAll`, `getNote`, `removeNote`, `logNote`
- `fetchNotes()`: Reads notes from JSON file
- `saveNotes()`: Writes notes to JSON file
- Note format: `{ title: string, body: string }`
- Prevents duplicate notes by title
- Uses colored console output for better UX (purple color for titles: `\x1b[35m`)

### helpers/argDocs.js
- Configures yargs commands and options
- Defines title and body options with aliases (t, b)
- Uses `demand: true` for required arguments

## Development Workflow

1. **Installing Dependencies**: `npm install`
2. **Running the Application**: `node app.js <command>`
3. **Linting**: Automatically runs via husky pre-commit hooks
4. **Releasing**: 
   - `npm run release` - Standard release
   - `npm run release:alpha` - Alpha pre-release
   - `npm run release:beta` - Beta pre-release
   - `npm run release:rc` - Release candidate

## CLI Commands

- `add --title "Title" --body "Content"` or `-t "Title" -b "Content"`
- `list` - Lists all notes
- `read --title "Title"` or `-t "Title"`
- `remove --title "Title"` or `-t "Title"`

## Dependencies

### Production
- **yargs**: CLI argument parsing (v15.0.2)
- **lodash**: Utility library (v4.17.15)
- **axios**: HTTP client (v1.7.9)

### Development
- **eslint**: Linting (v6.7.2)
- **prettier**: Code formatting (v1.19.1)
- **husky**: Git hooks (v9.1.7)
- **commitlint**: Commit message linting (@commitlint/cli v19.7.1)
- **release-it**: Version management and releasing (v17.11.0)
- **@slack/web-api**: Slack notifications (v7.8.0)

## Testing

Currently, there are no automated tests in this project. The test script in package.json outputs: "Error: opsss no test specified" and exits with code 1.

When adding new features:
- Manually test all CLI commands
- Verify note storage in `notes-data.json`
- Test edge cases (duplicate titles, missing arguments, non-existent notes)

## Best Practices

1. **Error Handling**: Use try-catch blocks when reading/writing files
2. **User Feedback**: Provide clear console messages for all operations
3. **Data Validation**: Check for duplicate titles before adding notes
4. **Immutability**: Use filter/map instead of mutating arrays directly
5. **Module Exports**: Export only necessary functions using CommonJS (`module.exports`)
6. **File Operations**: Use synchronous fs methods (readFileSync, writeFileSync) for simplicity in CLI context

## Code Conventions

- Use descriptive variable names (e.g., `noteAdded`, `allNotes`, `duplicateNotes`)
- Keep functions small and focused on a single responsibility
- Use template literals for string interpolation
- Add console logs for user feedback after operations
- Use arrow functions for array operations (filter, forEach, map)

## Release Process

The project uses release-it with conventional-changelog for automated versioning and changelog generation based on conventional commits.
