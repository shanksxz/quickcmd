# quickcmd

quickcmd is a command-line interface (CLI) tool that allows you to save and manage frequently used commands locally. It provides a convenient way to store, retrieve, add, update, and delete commands, making it easier to access them whenever needed through your CLI only.

## Installation

To get started with quickcmd, simply run the following command to install it globally:

```bash
npm install -g quickcmd
```

## Usage

### Setup

After installation, run qk -c to create the necessary directory for storing your commands. This step only needs to be done once, after the initial installation.

```bash
qk -d
```

### Saving a Command

To save a command, use the `-t` or `--title` option with `-c` or `--command`. Once entered, the command will be saved successfully.

```bash
❯ qk -t <title> -c <command>

ex:-
qk -t "docker" -c "docker ps"
```

### Retrieving Commands

To retrieve commands, use the `-g` or `--get` option

```bash
qk -g <title>

ex:-
qk -g docker
```

### Updating a Command

To update a command, use the `-e` or `--edit` option

```bash
qk -e <title>

ex:-
qk -e docker

```
### Removing a Command

To remove a command, use the `-r` or `--remove` option

```bash
qk -r <title>

ex:-
qk -r docker
```

### Execute a Command
You can directly execute command for an particular "title" you saved

```bash
qk -e <title>

ex:-

❯ qk -x npm
√ command · npm -v
10.5.0
```
### Summary

```bash
Usage: qk [options]

Options:
  --version          output the version number
  -c, --cmd      Save a command
  -t, --title        Title of the command
  -g, --get          Get a command
  -e, --edit         Edit a command
  -r, --remove       Remove a command
  -d, --dir          Create a directory for storing commands
  -x, --execute      Execute a command
  -h, --help         display help for command
```

### Data Storage

Your commands are stored in a JSON file located at `%LOCALAPPDATA%/qk/data.json` (Windows), Here's an example of how the data is structured:

```bash
[
    {
        "title": "prisma",
        "commands": [
            "npx prisma init"
        ]
    }
]
```

### Contributing

Contributions are welcome! If you find any issues or have ideas for improvements, please open an issue or submit a pull request on the GitHub repository.
