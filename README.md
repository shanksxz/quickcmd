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
qk -c
qk --help  # check for available commands
```

### Saving a Command

To save a command, use the `-a` or `--add` option, this will prompt you to enter the title and command you want to add. Once entered, the command will be saved successfully.

```bash
❯ qk -a
√ What title you want to give? · prisma
√ Enter command you want to add · npx prisma init
Command saved successfully
```

### Retrieving Commands

To retrieve commands, use the `-g` or `--get` option

```bash
qk -g
```

### Updating a Command

To update a command, use the `-e` or `--edit` option

```bash
qk -e
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
