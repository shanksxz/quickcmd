import fs from "fs";
import { defaultDataPath } from "./path";
import { CommandData } from "./types";
import { prompt } from "enquirer";
import { execSync } from "child_process";

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

function copyToClipboard(text: string) {
  try {
    const powershellCommand = `Set-Clipboard -Value '${text.replace(
      /'/g,
      "''"
    )}'`;
    execSync(`powershell.exe -Command "${powershellCommand}"`);
    console.log("Copied to clipboard");
  } catch (error) {
    console.error(`Error copying to clipboard: ${error}`);
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

export function getAvailableCommands() {
  try {
    const data = readFile();
    const titles = data?.map((item) => item.title) || [];
    console.log("Available commands titles:");
    titles.forEach((title) => console.log(title));
  } catch (error) {
    console.error(`Error retrieving available commands: ${error}`);
  }
}

export async function getCommands(title: string) {
  try {
    const data = readFile();
    const commands = data?.find((item) => item.title === title)?.commands || [];
 
    if (process.platform === "win32") {
      const choices = commands.map((command, _) => ({
        name: command,
      }));

      const { command } = await prompt<{ command: string }>({
        type: "select",
        name: "command",
        message: "Select the command you want to copy",
        choices,
      });

      copyToClipboard(command);
    } else {
      console.log(`Commands for "${title}":`);
      commands.forEach((command) => console.log(command));
    }

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
    const data = readFile();
    const commandData = data?.find((item) => item.title === title);

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

export async function editCommandPrompt(title: string) {
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
    return { index, newCommand };
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

    const choices = commandData.commands.map((c, _) => ({
      name: c,
    }));

    const { command } = await prompt<{ command: string }>({
      type: "select",
      name: "command",
      message: "",
      choices,
    });

    //? idk if there is an better way to do this
    const stdout = execSync(command);
    console.log(stdout.toString());
  } catch (error) {
    console.log("Error", error);
  }
}

export async function removeCommand(title: string) {
  try {
    const data = readFile();
    const commandData = data?.find((e) => e.title === title);

    if (!commandData) {
      console.log(`No command found with title "${title}"`);
      return;
    }

    const choices = commandData.commands.map((c, _) => ({
      name: c,
    }));

    const { command } = await prompt<{ command: string }>({
      type: "select",
      name: "command",
      message: "",
      choices,
    });

    const newCommands = commandData.commands.filter((c) => c !== command);

    if (newCommands.length === 0) {
      const newData = data?.filter((e) => e.title !== title);
      fs.writeFileSync(defaultDataPath, JSON.stringify(newData));
    } else {
      commandData.commands = newCommands;
      fs.writeFileSync(defaultDataPath, JSON.stringify(data));
    }

    console.log("Command removed successfully");
  } catch (error) {
    console.log("Error", error);
  }
}
