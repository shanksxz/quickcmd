import fs from "node:fs";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { readFile } from "../utils";
import { defaultDataPath } from "../utils";

export async function removeCommand(title: string) {
	try {
		if (title.length === 0) {
			console.log(chalk.yellow("Title cannot be empty"));
			return;
		}

		const data = readFile();
		if (!data) {
			console.log(chalk.red("Could not read command data."));
			return;
		}

		const commandIndex = data.findIndex((item) => item.title === title);

		if (commandIndex === -1) {
			console.log(
				chalk.yellow(`No commands found with title "${chalk.bold(title)}"`),
			);
			return;
		}

		const commandData = data[commandIndex];
		const commandsToRemove = await p.multiselect({
			message: `Select commands to remove for "${title}". (Press space to select)`,
			options: commandData.commands.map((cmd) => ({ label: cmd, value: cmd })),
			required: false,
		});

		if (p.isCancel(commandsToRemove)) {
			p.cancel("Operation cancelled");
			return;
		}

		if (commandsToRemove.length === 0) {
			console.log(chalk.yellow("No commands selected for removal."));
			return;
		}

		if (commandsToRemove.length === commandData.commands.length) {
			const confirmDelete = await p.confirm({
				message: `You are about to delete the entire '${title}' group. Are you sure?`,
			});

			if (confirmDelete && !p.isCancel(confirmDelete)) {
				data.splice(commandIndex, 1);
				fs.writeFileSync(defaultDataPath, JSON.stringify(data));
				p.outro(chalk.green(`Command group '${title}' removed successfully!`));
			} else {
				p.cancel("Operation cancelled");
			}
			return;
		}

		commandData.commands = commandData.commands.filter(
			(cmd) => !commandsToRemove.includes(cmd),
		);
		fs.writeFileSync(defaultDataPath, JSON.stringify(data));

		p.outro(chalk.green("Selected commands removed successfully!"));
	} catch (error) {
		p.cancel(chalk.red(`An error occurred: ${(error as Error).message}`));
	}
}
