import fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { defaultDataPath } from "../utils";

export function exportCommands(filePath: string) {
	try {
		if (!fs.existsSync(defaultDataPath)) {
			p.log.warn("No commands to export. The data file does not exist.");
			return;
		}

		const absolutePath = path.resolve(filePath);

		const data = fs.readFileSync(defaultDataPath, "utf-8");
		fs.writeFileSync(absolutePath, data);

		p.outro(chalk.green(`Commands successfully exported to ${absolutePath}`));
	} catch (error) {
		p.cancel(
			chalk.red(`An error occurred during export: ${(error as Error).message}`),
		);
	}
}
