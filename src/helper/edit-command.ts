import fs from "fs";
import chalk from "chalk";
import * as p from '@clack/prompts';
import { readFile } from "../utils";
import { defaultDataPath } from "../utils";

export function editCommand(
  title: string,
  commandIndex: number,
  newCommand: string
) {
  try {
    const data = readFile();
    const commandData = data?.find((item) => item.title === title);

    if (!commandData) {
      console.log(chalk.yellow(`No commands found with title "${chalk.bold(title)}"`));
      return;
    }

    if (
      commandIndex - 1 < 0 ||
      commandIndex - 1 >= commandData.commands.length
    ) {
      console.log(chalk.yellow("Invalid command index"));
      return;
    }

    commandData.commands[commandIndex - 1] = newCommand;
    fs.writeFileSync(defaultDataPath, JSON.stringify(data));
    console.log(chalk.green("Command edited successfully"));
  } catch (error) {
    console.error(chalk.red(`Error editing command: ${error}`));
  }
}

export async function editCommandPrompt(title: string) {
  try {
    if(title.length === 0) {
      console.log(chalk.yellow("Title cannot be empty"));
      return;
    }

    const data = readFile();
    const commandData = data?.find((item) => item.title === title);

    if (!commandData) {
      console.log(chalk.yellow(`No commands found with title "${chalk.bold(title)}"`));
      return { title };
    }

    const choices = commandData.commands.map((command, index) => ({
      label: command,
      value: index,
    }));

    p.intro(chalk.blue.bold(`Editing commands for "${title}"`));
    
    const commandIndex = await p.select({
      message: chalk.yellow('Select the command you want to edit'),
      options: choices,
    });

    if (p.isCancel(commandIndex)) {
      p.cancel(chalk.red('Operation cancelled'));
      return { title };
    }

    const newCommand = await p.text({
      message: chalk.yellow('Enter the new command'),
      placeholder: commandData.commands[commandIndex as number],
      validate: (value) => {
        if (!value) return chalk.red('Command cannot be empty');
      }
    });

    if (p.isCancel(newCommand)) {
      p.cancel(chalk.red('Operation cancelled'));
      return { title };
    }

    p.outro(chalk.green('Command updated successfully!'));
    
    return { index: (commandIndex as number) + 1, newCommand: newCommand as string };
  } catch (error) {
    console.error(chalk.red(`Error editing command: ${error}`));
    return { title };
  }
}