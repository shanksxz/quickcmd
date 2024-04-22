import { prompt } from "enquirer";

export async function promptAddCommand(): Promise<{ title: string; command: string }> {
  return await prompt([
    {
      type: "input",
      name: "title",
      message: "What title you want to give?",
    },
    {
      type: "input",
      name: "command",
      message: "Enter command you want to add",
    },
  ]);
}

export async function promptGetCommands(): Promise<{ title: string }> {
  return await prompt({
    type: "input",
    name: "title",
    message: "Whose commands you want to see?",
  });
}

export async function promptEditCommand(): Promise<{ title: string; index: number | undefined; newCommand: string }> {
  return await prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the title of the command you want to edit",
    },
    {
      type: "input",
      name: "index",
      message: "Enter the index of the command you want to edit",
      initial: undefined,
    },
    {
      type: "input",
      name: "newCommand",
      message: "Enter the new command",
    },
  ]);
}
