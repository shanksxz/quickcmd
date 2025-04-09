import chalk from "chalk";
import { readFile } from "../utils";
import { CommandData } from "../types";

export function getAvailableCommands() {
  try {
    const data = readFile();
    const titles = data?.map((item: CommandData) => item.title) || [];
    console.log(chalk.blue.bold("Available commands titles:"));
    titles.forEach((title) => console.log(chalk.cyan(`  • ${title}`)));
  } catch (error) {
    console.error(chalk.red(`Error retrieving available commands: ${error}`));
  }
}