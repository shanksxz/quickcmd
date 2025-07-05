import chalk from "chalk";
import { Command } from "commander";
import {
	addCommands,
	editCommand,
	editCommandPrompt,
	exportCommands,
	getAvailableCommands,
	getCommands,
	importCommands,
	removeCommand,
	runCommand,
	searchCommands,
} from "./helper";
import { createDir, defaultDirPath } from "./utils";

async function main() {
	const program = new Command();

	program
		.name(chalk.bold("qk"))
		.description(
			chalk.cyan(
				"quickcmd is a CLI tool for managing and accessing frequently used commands easily",
			),
		)
		.version(chalk.green("1.0.8"));

	program
		.command("add")
		.description("Save a new command")
		.requiredOption("-t, --title <title>", "Title for the command group")
		.requiredOption("-c, --cmd <command>", "Command to save")
		.action(({ title, cmd }) => {
			addCommands(title, cmd);
		});

	program
		.command("list")
		.description("List all available command titles")
		.action(getAvailableCommands);

	program
		.command("get")
		.description("Get commands by title")
		.argument("<title>", "Title of the command group to get")
		.action(getCommands);

	program
		.command("run")
		.description("Interactively run a command from a group")
		.argument("<title>", "Title of the command group to run from")
		.action(runCommand);

	program
		.command("remove")
		.description("Remove a command by title")
		.argument("<title>", "Title of the command group to remove from")
		.action((title) => {
			removeCommand(title);
		});

	program
		.command("edit")
		.description("Edit an existing command")
		.argument("<title>", "Title of the command group to edit")
		.action(async (title) => {
			const result = await editCommandPrompt(title);
			if (result?.index !== undefined && result?.newCommand) {
				editCommand(title, result.index, result.newCommand);
			}
		});

	program
		.command("search")
		.description("Search for commands by keyword")
		.argument("<keyword>", "Keyword to search for")
		.action(searchCommands);

	program
		.command("init")
		.description("Initialize storage directory")
		.action(() => {
			createDir(defaultDirPath);
		});

	program
		.command("path")
		.description("Show path to commands storage")
		.action(() => {
			console.log(
				chalk.blue(`Commands stored at: ${chalk.bold(defaultDirPath)}`),
			);
		});

	program
		.command("export")
		.description("Export all commands to a JSON file")
		.argument("<filepath>", "The file path to export to")
		.action(exportCommands);

	program
		.command("import")
		.description("Import commands from a JSON file")
		.argument("<filepath>", "The file path to import from")
		.action(importCommands);

	program.addHelpText(
		"after",
		`
${chalk.blue.bold("Examples:")}
  ${chalk.green('$ qk add -t "git" -c "git status"')}    ${chalk.dim(
		"Save a new git command",
	)}
  ${chalk.green('$ qk get "git"')}                       ${chalk.dim(
		"Display all git commands",
	)}
  ${chalk.green('$ qk run "git"')}                       ${chalk.dim(
		"Interactively run a git command",
	)}
  ${chalk.green('$ qk search "status"')}                  ${chalk.dim(
		"Search for commands containing 'status'",
	)}
  ${chalk.green('$ qk export "my-commands.json"')}         ${chalk.dim(
		"Export all commands to a file",
	)}
  ${chalk.green('$ qk import "my-commands.json"')}         ${chalk.dim(
		"Import commands from a file",
	)}

${chalk.dim("For more information visit")} ${chalk.cyan(
			"https://github.com/shanksxz/quickcmd",
		)}`,
	);

	await program.parseAsync(process.argv);
}

main();
