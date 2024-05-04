#!/usr/bin/env node

import yargs, { alias } from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addCommands,
  createDir,
  editCommand,
  editCommandPrompt,
  executeCommand,
  getCommands,
  removeCommand,
} from "./utils/commands";
import { defaultDirPath } from "./utils/path";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      t: {
        type: "string",
        alias: "title",
        description: "title for the command",
      },
      c: {
        type: "string",
        alias: "cmd",
        description: "command to be saved, must be used with -t flag",
      },
      d: {
        type: "boolean",
        alias: "dir",
        description: "Create a directory for storing the commands",
      },
      r: {
        type: "string",
        alias: "remove",
        description: "remove a command",
      },
      g: { type: "string", alias: "get", description: "Get saved commands" },
      e: {
        type: "string",
        alias: "edit",
        description: "Edit an existing command",
      },
      p: { type: "boolean", alias: "path", description: "Get path" },
      x: {
        type: "string",
        alias: "execute",
        description: "execute an command from the list",
      },
    })
    .parseSync();

  if (argv.t && argv.c) {
    addCommands(argv.t, argv.c);
  } else if (argv.d) {
    createDir(defaultDirPath);
  } else if (argv.g) {
    getCommands(argv.g);
  } else if (argv.r) {
    removeCommand(argv.r);
  } else if (argv.e) {
    const { index, newCommand } = await editCommandPrompt(argv.e);
    if (index !== undefined) {
      editCommand(argv.e, index, newCommand);
    }
  } else if (argv.p) {
    console.log(`${defaultDirPath}`);
  } else if (argv.x) {
    executeCommand(argv.x);
  }
}

main();
