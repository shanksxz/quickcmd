import chalk from "chalk";
import { readFile } from "../utils";
import type { CommandData } from "../types";

export function getAvailableCommands() {
    try {
        const data = readFile();
        const titles = data?.map((item: CommandData) => item.title) || [];
        console.log(chalk.blue.bold("Available commands titles:"));
        for (const title of titles) {
            console.log(chalk.cyan(`  • ${title}`));
        }
    } catch (error) {
        console.error(
            chalk.red(`Error retrieving available commands: ${error}`)
        );
    }
}
