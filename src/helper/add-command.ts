import fs from "node:fs";
import chalk from "chalk";
import type { CommandData } from "../types";
import { defaultDataPath } from "../utils";

export function addCommands(title: string, command: string) {
	try {
		if (title.length === 0 && command.length === 0) {
			console.log(chalk.yellow("Fields cannot be empty"));
			return;
		}

		const existingData: CommandData[] = fs.existsSync(defaultDataPath)
			? JSON.parse(fs.readFileSync(defaultDataPath, "utf-8"))
			: [];

		const oldData = existingData.find((item) => item.title === title);

		if (oldData) {
			const check = oldData.commands.every((ele) => ele !== command);
			if (!check) {
				console.log(
					chalk.yellow(
						`Command '${chalk.bold(command)}' already exists for '${chalk.bold(title)}'`,
					),
				);
				return;
			}
			oldData.commands = [...oldData.commands, command];
		} else {
			existingData.push({ title, commands: [command] });
		}

		fs.writeFileSync(defaultDataPath, JSON.stringify(existingData));
		console.log(chalk.green("Command saved successfully"));
	} catch (error) {
		console.error(chalk.red(`Error saving command: ${error}`));
	}
}
