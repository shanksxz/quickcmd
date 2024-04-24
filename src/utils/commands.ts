import fs, { read } from "fs";
import { defaultDataPath, defaultDirPath } from "./path";
import { CommandData } from "./types";
import { prompt } from "enquirer";
import { command } from "yargs";
import { exec, execSync } from "child_process";

export function createDir(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    }
  } catch (error) {
    console.error(`Error creating directory: ${error}`);
  }
}

export function readFile() {
  try {
    const fileContent = fs.readFileSync(defaultDataPath, "utf-8");
    const data: CommandData[] = JSON.parse(fileContent);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export function addCommands(title: string, command: string) {
  try {
    if (title.length == 0 && command.length == 0) {
      console.log("Fields cannot be empty");
      return;
    }

    const existingData: CommandData[] = fs.existsSync(defaultDataPath)
      ? JSON.parse(fs.readFileSync(defaultDataPath, "utf-8"))
      : [];

    const oldData = existingData.find((item) => item.title === title);

    if (oldData) {
      const check = oldData.commands.every((ele) => ele !== command);
      if (!check) {
        console.log(`Command '${command}' already exists for '${title}'`);
        return;
      }
      oldData.commands = [...oldData.commands, command];
    } else {
      existingData.push({ title, commands: [command] });
    }

    fs.writeFileSync(defaultDataPath, JSON.stringify(existingData));
    console.log("Command saved successfully");
  } catch (error) {
    console.error(`Error saving command: ${error}`);
  }
}

export function getCommands(title: string) {
  try {
    const data = readFile();
    const commands = data?.find((item) => item.title === title)?.commands || [];

    console.log(`Commands for "${title}":`);
    commands.forEach((command) => console.log(command));
  } catch (error) {
    console.error(`Error retrieving commands: ${error}`);
  }
}

export function editCommand(
  title: string,
  commandIndex: number,
  newCommand: string
) {
  try {
    const fileContent = fs.readFileSync(defaultDataPath, "utf-8");
    const data: CommandData[] = JSON.parse(fileContent);
    const commandData = data.find((item) => item.title === title);

    if (!commandData) {
      console.log(`No commands found with title "${title}"`);
      return;
    }

    if (
      commandIndex - 1 < 0 ||
      commandIndex - 1 >= commandData.commands.length
    ) {
      console.log("Invalid command index");
      return;
    }

    commandData.commands[commandIndex - 1] = newCommand;
    fs.writeFileSync(defaultDataPath, JSON.stringify(data));
    console.log("Command edited successfully");
  } catch (error) {
    console.error(`Error editing command: ${error}`);
  }
}

export async function editCommandPrompt() {
  const { title } = await prompt<{ title: string }>({
    type: "input",
    name: "title",
    message: "What is the title of the command you want to edit?",
  });

  try {
    const data = readFile();
    const commandData = data?.find((item) => item.title === title);

    if (!commandData) {
      console.log(`No commands found with title "${title}"`);
      return { title };
    }

    const choices = commandData.commands.map((command, index) => ({
      name: `${index + 1} ${command}`,
      value: index,
    }));

    const { commandIndex } = await prompt<{ commandIndex: string }>({
      type: "select",
      name: "commandIndex",
      message: "Select the command you want to edit",
      choices,
    });

    const { newCommand } = await prompt<{ newCommand: string }>({
      type: "input",
      name: "newCommand",
      message: "Enter the new command",
    });

    const index = parseInt(commandIndex.split(" ")[0]);
    return { title, index, newCommand };
  } catch (error) {
    console.error(`Error editing command: ${error}`);
    return { title };
  }
}

export async function executeCommand(title: string) {
  try {
    const data = readFile();
    const commandData = data?.find((e) => e.title === title);

    if (!commandData) {
      console.log(`No command found with title "${title}"`);
      return;
    }

    const choices = commandData.commands.map((c, i) => ({
      name: c,
    }));

    const { command } = await prompt<{ command: string }>({
      type: "select",
      name: "command",
      message: "",
      choices,
    });

    const stdout = execSync(command);
    console.log(stdout.toString());
  } catch (error) {
    console.log("Error", error);
  }
}
