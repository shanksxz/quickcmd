#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addCommands,
  createDir,
  editCommand,
  editCommandPrompt,
  executeCommand,
  getAvailableCommands,
  getCommands,
  removeCommand,
} from "./utils/commands";
import { defaultDirPath } from "./utils/path";

function is(
  arg: string | boolean | number | string[] | undefined
): arg is string {
  return typeof arg === "string";
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      a: {
        type: "boolean",
        alias: "all",
        description: "all the available commands titles",
      },
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

  switch (true) {
    case argv.a:
      getAvailableCommands();
      break;
    case is(argv.t) && is(argv.c):
      addCommands(argv.t, argv.c);
      break;
    case argv.d:
      createDir(defaultDirPath);
      break;
    case is(argv.g):
      getCommands(argv.g);
      break;
    case is(argv.r):
      removeCommand(argv.r);
      break;
    case is(argv.e):
      const { index, newCommand } = await editCommandPrompt(argv.e);
      if (index !== undefined) {
        editCommand(argv.e, index, newCommand);
      }
      break;
    case argv.p:
      console.log(`${defaultDirPath}`);
      break;
    case is(argv.x):
      executeCommand(argv.x);
      break;
    default:
      yargs.showHelp();
  }
}

main();
