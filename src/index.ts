#!/usr/bin/env node

import yargs, { alias, describe } from "yargs";
import { hideBin } from "yargs/helpers";
import { prompt } from "enquirer";
import {
  addCommands,
  createDir,
  editCommand,
  editCommandPrompt,
  getCommands,
} from "./utils/commands";
import { promptAddCommand } from "./utils/prompt";
import { defaultDirPath } from "./utils/path";

async function main() {
  const argv = yargs(hideBin(process.argv))
    .options({
      a: { type: "boolean", alias: "add", description: "Add a new command" },
      c: {
        type: "boolean",
        alias: "directory",
        description: "create the directory to store the data",
      },
      g: { type: "boolean", alias: "get", description: "Get saved commands" },
      e: {
        type: "boolean",
        alias: "edit",
        description: "Edit an existing command",
      },
      p: { type: "boolean", alias: "path", description: "Get path" },
    })
    .parseSync();

  switch (true) {
    case argv.a:
      const { title: addTitle, command } = await promptAddCommand();
      addCommands(addTitle, command);
      break;
    case argv.c:
      createDir(defaultDirPath);
      break;
    case argv.g:
      const { title: getTitle } = await prompt<{ title: string }>({
        type: "input",
        name: "title",
        message: "Whose commands you want to see?",
      });
      getCommands(getTitle);
      break;
    case argv.e:
      const { title: editTitle, index, newCommand } = await editCommandPrompt();
      if (index !== undefined) {
        editCommand(editTitle, index, newCommand);
      }
      break;
    case argv.p:
      console.log(`${defaultDirPath}`);
      break;
    default:
      console.error(
        "Invalid command. Please use --help for available commands."
      );
      break;
  }
}

main();
