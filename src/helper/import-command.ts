import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import chalk from "chalk";
import type { CommandData } from "../types";
import { defaultDataPath, readFile } from "../utils";

export async function importCommands(filePath: string) {
	try {
		const absolutePath = path.resolve(filePath);
		if (!fs.existsSync(absolutePath)) {
			p.log.error(`The specified file does not exist: ${absolutePath}`);
			return;
		}

		const fileContent = fs.readFileSync(absolutePath, "utf-8");
		if (fileContent) {
			const importedData: CommandData[] = JSON.parse(fileContent);

			const existingData = fs.existsSync(defaultDataPath) ? readFile() : [];
			if (!existingData) {
				p.log.error("Could not read existing data file.");
				return;
			}
			let addedCount = 0;
			let mergedCount = 0;

			for (const importedGroup of importedData) {
				const existingGroup = existingData.find(
					(g) => g.title === importedGroup.title,
				);

				if (existingGroup) {
					// Merge commands, avoiding duplicates
					const commandsToAdd = importedGroup.commands.filter(
						(cmd) => !existingGroup.commands.includes(cmd),
					);
					if (commandsToAdd.length > 0) {
						existingGroup.commands.push(...commandsToAdd);
						mergedCount++;
					}
				} else {
					// Add new group
					existingData.push(importedGroup);
					addedCount++;
				}
			}

			if (addedCount === 0 && mergedCount === 0) {
				p.outro(chalk.yellow("No new commands or groups to import."));
				return;
			}

			fs.writeFileSync(defaultDataPath, JSON.stringify(existingData, null, 2));

			p.outro(
				chalk.green(
					`Import successful! Added ${addedCount} new groups and merged ${mergedCount} existing groups.`,
				),
			);
		}
	} catch (error) {
		p.cancel(
			chalk.red(`An error occurred during import: ${(error as Error).message}`),
		);
	}
}
