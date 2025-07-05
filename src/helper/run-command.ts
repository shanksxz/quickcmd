import { spawn } from "node:child_process";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { readFile } from "../utils";

async function getCommandsByTitle(title: string) {
	const data = readFile();
	const commandData = data?.find((item) => item.title === title);
	return commandData;
}

export async function runCommand(title: string) {
	try {
		const commandData = await getCommandsByTitle(title);

		if (!commandData || commandData.commands.length === 0) {
			p.log.warn(`No commands found for '${title}'.`);
			return;
		}

		const selectedCommand = await p.select({
			message: `Select a command to run for '${title}'`,
			options: commandData.commands.map((cmd) => ({
				value: cmd,
				label: cmd,
			})),
		});

		if (p.isCancel(selectedCommand)) {
			p.cancel("Operation cancelled.");
			return;
		}

		p.outro(chalk.green(`Executing: ${selectedCommand}`));

		const child = spawn(selectedCommand as string, {
			stdio: "inherit",
			shell: true,
		});

		child.on("error", (error) => {
			console.error(chalk.red(`\nFailed to start command: ${error.message}`));
		});

		child.on("close", (code) => {
			if (code !== 0) {
				console.log(chalk.yellow(`\nCommand exited with code ${code}`));
			}
		});
	} catch (error) {
		p.cancel(chalk.red(`An error occurred: ${(error as Error).message}`));
	}
}
