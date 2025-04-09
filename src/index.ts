import chalk from "chalk";
import { Command } from "commander";
import {
	addCommands,
	editCommand,
	editCommandPrompt,
	getAvailableCommands,
	getCommands,
	removeCommand,
} from "./helper";
import { createDir, defaultDirPath } from "./utils";

function isValidString(value: unknown): value is string {
	return typeof value === "string" && value.length > 0;
}

async function main() {
	const program = new Command();

	program
		.name(chalk.bold("qk"))
		.description(
			chalk.cyan(
				"quickcmd is a CLI tool for managing and accessing frequently used commands easily",
			),
		)
		.version(chalk.green("1.0.5"));

	program
		.option("-a, --all", chalk.yellow("List all available command titles"))
		.option("-t, --title <title>", chalk.yellow("Title for the command group"))
		.option(
			"-c, --cmd <command>",
			chalk.yellow("Command to save (use with -t)"),
		)
		.option("-d, --dir", chalk.yellow("Initialize storage directory"))
		.option("-r, --remove <title>", chalk.yellow("Remove a command by title"))
		.option("-g, --get <title>", chalk.yellow("Get commands by title"))
		.option("-e, --edit <title>", chalk.yellow("Edit existing command"))
		.option("-p, --path", chalk.yellow("Show path to commands storage"));
	//TODO: implement search, export, import
	// .option("-s, --search <keyword>", chalk.yellow("Search commands by keyword"))
	// .option("--export <filePath>", chalk.yellow("Export commands to file"))
	// .option("--import <filePath>", chalk.yellow("Import commands from file"));

	program.addHelpText(
		"after",
		`
${chalk.blue.bold("Examples:")}
  ${chalk.green('$ qk -t "git" -c "git status"')}    ${chalk.dim("Save a new git command")}
  ${chalk.green('$ qk -g "git"')}                    ${chalk.dim("List all git commands")}

${chalk.dim("For more information visit")} ${chalk.cyan("https://github.com/shanksxz/quickcmd")}`,
	);

	program.parse();
	const options = program.opts();

	switch (true) {
		case options.all:
			getAvailableCommands();
			break;

		case options.title && options.cmd:
			addCommands(options.title, options.cmd);
			break;

		case options.dir:
			createDir(defaultDirPath);
			break;

		case isValidString(options.get):
			getCommands(options.get);
			break;

		case isValidString(options.remove):
			removeCommand(options.remove);
			break;

		case isValidString(options.edit): {
			const result = await editCommandPrompt(options.edit);
			if (result?.index !== undefined) {
				editCommand(options.edit, result?.index, result?.newCommand);
			}
			break;
		}

		case options.path:
			console.log(
				chalk.blue(`Commands stored at: ${chalk.bold(defaultDirPath)}`),
			);
			break;

		// Commented out until implementation is available
		// case isValidString(options.search):
		//     searchCommands(options.search);
		//     break;

		// case isValidString(options.export):
		//     exportCommands(options.export);
		//     break;

		// case isValidString(options.import):
		//     importCommands(options.import);
		//     break;
	}
}

main();
