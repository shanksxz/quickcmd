import * as p from "@clack/prompts";
import chalk from "chalk";
import { readFile } from "../utils";

export async function searchCommands(keyword: string) {
	try {
		const data = readFile();
		if (!data || data.length === 0) {
			p.log.warn("No commands found. Add one with 'qk add'.");
			return;
		}

		const lowerCaseKeyword = keyword.toLowerCase();

		const searchResults = data
			.map((group) => {
				const filteredCommands = group.commands.filter(
					(command) =>
						group.title.toLowerCase().includes(lowerCaseKeyword) ||
						command.toLowerCase().includes(lowerCaseKeyword),
				);

				if (filteredCommands.length > 0) {
					return {
						...group,
						commands: filteredCommands,
					};
				}
				return null;
			})
			.filter((result) => result !== null);

		if (searchResults.length === 0) {
			p.log.info(`No commands found matching '${keyword}'.`);
			return;
		}

		p.intro(
			chalk.blue(`Found ${searchResults.length} groups matching '${keyword}'`),
		);

		for (const group of searchResults) {
			if (group) {
				console.log(chalk.cyan.bold(`  ${group.title}`));
				for (const command of group.commands) {
					console.log(`    - ${command}`);
				}
			}
		}

		p.outro(chalk.green("Search complete."));
	} catch (error) {
		p.cancel(chalk.red(`An error occurred: ${(error as Error).message}`));
	}
}
