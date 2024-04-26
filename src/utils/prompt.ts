import { prompt } from "enquirer";

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
