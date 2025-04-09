import chalk from "chalk";
import { readFile } from "../utils";

export async function getCommands(title: string) {
	try {
		if (title.length === 0) {
			console.log(chalk.yellow("Title cannot be empty"));
			return;
		}

		const data = readFile();
		const commands = data?.find((item) => item.title === title)?.commands || [];

		if (commands.length === 0) {
			console.log(chalk.yellow(`No commands found for "${chalk.bold(title)}"`));
			return;
		}

		console.log(chalk.blue.bold(`Commands for "${chalk.bold(title)}":`));
		commands.forEach((command, index) =>
			console.log(chalk.cyan(`  ${index + 1}. ${command}`)),
		);
	} catch (error) {
		console.error(chalk.red(`Error retrieving commands: ${error}`));
	}
}
