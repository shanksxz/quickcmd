#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  addCommands,
  editCommand,
  editCommandPrompt,
  executeCommand,
  getCommands,
} from "./utils/commands";
import { defaultDirPath } from "./utils/path";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      a: { type: "string", alias: "add", description: "Add a new command" },
      c: {
        type: "string",
        alias: "command",
        description: "for command, must use with -a",
      },
      g: { type: "string", alias: "get", description: "Get saved commands" },
      e: {
        type: "string",
        alias: "edit",
        description: "Edit an existing command",
      },
      p: { type: "boolean", alias: "path", description: "Get path" },
      x: { type: "string", alias: "execute", description: "execute an command from the list"}
    })
    .parseSync();

  if(argv.a && argv.c) {
    addCommands(argv.a, argv.c)
  } else if(argv.g) {
    getCommands(argv.g)
  } else if(argv.e) {
    const { index, newCommand } = await editCommandPrompt(argv.e)
    if (index !== undefined) {
      editCommand(argv.e, index, newCommand)
    }
  } else if(argv.p) {
    console.log(`${defaultDirPath}`)
  } else if(argv.x) {
    executeCommand(argv.x)
  }
}

main();
