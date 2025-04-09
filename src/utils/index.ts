import fs from "fs";
import chalk from "chalk";
import { CommandData } from "../types";
import os from "os";
import path from "path";

export const folderName = "qk";
export const localAppDataPath = process.env.LOCALAPPDATA || os.homedir();
export const defaultDirPath = path.join(localAppDataPath, folderName);
export const defaultDataPath = path.join(defaultDirPath, "data.json");

export function checkIfDirExists(dirPath: string) {
    try {
        return fs.existsSync(dirPath);
    } catch (error) {
        console.error(
            chalk.red(`Error checking if directory exists: ${error}`)
        );
    }
}

export function createDir(dirPath: string) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(
                chalk.green(`Directory created: ${chalk.bold(dirPath)}`)
            );
        }
    } catch (error) {
        console.error(chalk.red(`Error creating directory: ${error}`));
    }
}

export function readFile() {
    try {
        const fileContent = fs.readFileSync(defaultDataPath, "utf-8");
        const data: CommandData[] = JSON.parse(fileContent);
        return data;
    } catch (error) {
        console.log(chalk.red("Error reading file"), error);
    }
}
