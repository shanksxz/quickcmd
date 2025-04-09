import * as p from "@clack/prompts";
import chalk from "chalk";

export async function promptEditCommand(): Promise<{
	title: string;
	index: number | undefined;
	newCommand: string;
}> {
	p.intro(chalk.blue.bold("Edit Command"));

	const title = await p.text({
		message: chalk.yellow("Enter the title of the command you want to edit"),
		placeholder: "e.g. git",
		validate: (value) => {
			if (!value) return chalk.red("Title cannot be empty");
		},
	});

	if (p.isCancel(title)) {
		p.cancel(chalk.red("Operation cancelled"));
		return { title: "", index: undefined, newCommand: "" };
	}

	const indexInput = await p.text({
		message: chalk.yellow("Enter the index of the command you want to edit"),
		placeholder: "e.g. 1",
		validate: (value) => {
			if (value && Number.isNaN(Number(value)))
				return chalk.red("Index must be a number");
		},
	});

	if (p.isCancel(indexInput)) {
		p.cancel(chalk.red("Operation cancelled"));
		return { title: title as string, index: undefined, newCommand: "" };
	}

	const index = indexInput ? Number.parseInt(indexInput as string) : undefined;

	const newCommand = await p.text({
		message: chalk.yellow("Enter the new command"),
		placeholder: "e.g. git status",
		validate: (value) => {
			if (!value) return chalk.red("Command cannot be empty");
		},
	});

	if (p.isCancel(newCommand)) {
		p.cancel(chalk.red("Operation cancelled"));
		return { title: title as string, index, newCommand: "" };
	}

	p.outro(chalk.green("Command ready to be updated"));

	return {
		title: title as string,
		index,
		newCommand: newCommand as string,
	};
}
