import * as p from "@clack/prompts";
import chalk from "chalk";
import { readFile } from "../utils";

export function getCommands(title: string) {
	try {
		const data = readFile();
		if (!data || data.length === 0) {
			p.log.warn("No commands found. Add one with 'qk add'.");
			return;
		}

		const commandData = data.find((item) => item.title === title);

		if (!commandData) {
			p.log.warn(`No commands found with title "${chalk.bold(title)}".`);
			console.log(chalk.dim(`Run 'qk list' to see available titles.`));
			return;
		}

		p.intro(chalk.blue(`Commands for '${title}':`));
		for (const command of commandData.commands) {
			console.log(`  ${chalk.green("›")} ${command}`);
		}
		p.outro(chalk.green("Done."));
	} catch (error) {
		p.cancel(chalk.red(`An error occurred: ${(error as Error).message}`));
	}
}
