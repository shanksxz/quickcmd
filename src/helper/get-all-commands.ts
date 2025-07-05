import * as p from "@clack/prompts";
import chalk from "chalk";
import type { CommandData } from "../types";
import { readFile } from "../utils";

export function getAvailableCommands() {
	try {
		const data = readFile();
		if (!data || data.length === 0) {
			p.log.warn("No commands found. Add one with 'qk add'.");
			return;
		}

		const titles = data.map((item: CommandData) => item.title);
		p.log.info("Available command titles:");
		for (const title of titles) {
			console.log(chalk.cyan(`- ${title}`));
		}
	} catch (error) {
		p.cancel(`An error occurred: ${(error as Error).message}`);
	}
}
