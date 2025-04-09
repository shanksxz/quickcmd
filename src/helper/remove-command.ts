import chalk from "chalk";
import fs from "node:fs";
import * as p from "@clack/prompts";
import { readFile } from "../utils";
import { defaultDataPath } from "../utils";

export async function removeCommand(title: string) {
  try {
    if(title.length === 0) {
      console.log(chalk.yellow("Title cannot be empty"));
      return;
    }

    const data = readFile();
    const commandData = data?.find((item) => item.title === title);

    if (!commandData) {
      console.log(chalk.yellow(`No commands found with title "${chalk.bold(title)}"`));
      return;
    }

    if (commandData.commands.length === 1) {
      const confirmDelete = await p.confirm({
        message: `This will delete the only command for "${title}". Do you want to proceed?`,
      });

      if (p.isCancel(confirmDelete) || !confirmDelete) {
        p.cancel('Operation cancelled');
        return;
      }

      const filteredData = data?.filter((item) => item.title !== title);
      fs.writeFileSync(defaultDataPath, JSON.stringify(filteredData));
      console.log(chalk.green(`Command with title "${chalk.bold(title)}" deleted successfully`));
      return;
    }

    const choices = commandData.commands.map((command, index) => ({
      label: command,
      value: index,
    }));

    p.intro(`Removing command for "${title}"`);
    
    const commandIndex = await p.select({
      message: 'Select the command you want to remove',
      options: choices,
    });

    if (p.isCancel(commandIndex)) {
      p.cancel('Operation cancelled');
      return;
    }

    commandData.commands.splice(commandIndex as number, 1);
    fs.writeFileSync(defaultDataPath, JSON.stringify(data));
    
    p.outro(chalk.green('Command removed successfully!'));
  } catch (error) {
    console.error(chalk.red(`Error removing command: ${error}`));
  }
}