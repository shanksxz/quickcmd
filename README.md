# quickcmd ⚡

quickcmd is a command-line interface (CLI) tool that helps you save and manage your frequently used shell commands. It provides a convenient way to store, retrieve, search, and execute commands, making your workflow faster and more efficient, all from your terminal.

## Installation

To get started with `quickcmd`, install it globally using your preferred package manager:

```bash
# Using npm
npm install -g quickcmd

# Using pnpm
pnpm install -g quickcmd

# Using bun
bun install -g quickcmd
```

## Initial Setup

After installation, run the `init` command to create the necessary directory and files for storing your commands. This only needs to be done once.

```bash
qk init
```

## Commands

`quickcmd` uses an intuitive subcommand structure. Here is a complete list of available commands:

| Command           | Alias | Description                                                 |
| ----------------- | ----- | ----------------------------------------------------------- |
| `qk init`         |       | Initializes the storage directory.                          |
| `qk list`         | `ls`  | Lists all saved command groups by title.                    |
| `qk add`          |       | Adds a new command to a specified group.                    |
| `qk get <title>`  |       | Displays all commands within a specific group.              |
| `qk run <title>`  |       | Interactively select and execute a command from a group.    |
| `qk edit <title>` |       | Edits an existing command in a group.                       |
| `qk remove <title>` | `rm`  | Interactively removes commands from a group.                |
| `qk search <query>` |       | Searches for commands by title or content.                  |
| `qk import <path>`  |       | Imports commands from a JSON file and merges them.          |
| `qk export <path>`  |       | Exports all saved commands to a JSON file.                  |
| `qk path`         |       | Displays the path to the storage file.                      |

## Usage Examples

### Adding a Command

Save a new command under a group title. If the group doesn't exist, it will be created.

```bash
❯ qk add -t "docker" -c "docker-compose up -d"
✔ Command saved successfully.
```

### Listing all Command Groups

See all the groups you have saved.

```bash
❯ qk list
Available command titles:
- git
- docker
- npm
```

### Running a Command

Select a group title to see its commands, then choose one to execute immediately.

```bash
❯ qk run git
✔ Select a command to run › - Use arrow-keys. Return to submit.
│   git status
│   git push
└   git pull --rebase
```

### Searching for a Command

Find a command when you can't remember the group.

```bash
❯ qk search "commit"
✔ Found 2 matching commands for "commit":

git
- git commit -m "feat: initial commit"

github
- gh release create v1.0.0
```

### Import & Export

Backup your commands or share them with your team.

```bash
# Export to a file
qk export ./my_commands.json

# Import from a file
qk import ./my_commands.json
```

## Data Storage

Your commands are stored in a simple JSON file located in your user home directory. To find the exact location, run:

```bash
qk path
```

The data structure looks like this:

```json
[
  {
    "title": "git",
    "commands": ["git status", "git push"]
  }
]
```

## Contributing

Contributions are welcome! If you find any issues or have ideas for improvements, please open an issue or submit a pull request on the GitHub repository.

For more detailed information on how to contribute, please see our [Contributing Guide](./CONTRIBUTING.md).
