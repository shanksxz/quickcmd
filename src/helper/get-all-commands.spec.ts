import * as p from "@clack/prompts";
import chalk from "chalk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "../utils";
import { getAvailableCommands } from "./get-all-commands";

vi.mock("../utils");
vi.mock("@clack/prompts", () => ({
	log: {
		info: vi.fn(),
		warn: vi.fn(),
	},
}));

describe("getAvailableCommands", () => {
	const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

	beforeEach(() => {
		vi.mocked(readFile).mockReset();
		logSpy.mockClear();
		vi.mocked(p.log.info).mockClear();
		vi.mocked(p.log.warn).mockClear();
	});

	it("should list all available command titles", () => {
		const MOCK_DATA = [
			{ title: "git", commands: ["git status"] },
			{ title: "docker", commands: ["docker ps"] },
		];
		vi.mocked(readFile).mockReturnValue(MOCK_DATA);

		getAvailableCommands();

		expect(p.log.info).toHaveBeenCalledWith("Available command titles:");
		expect(logSpy).toHaveBeenCalledWith(chalk.cyan("- git"));
		expect(logSpy).toHaveBeenCalledWith(chalk.cyan("- docker"));
	});

	it("should show a warning if no commands are available", () => {
		vi.mocked(readFile).mockReturnValue([]);
		getAvailableCommands();
		expect(p.log.warn).toHaveBeenCalledWith(
			"No commands found. Add one with 'qk add'.",
		);
	});
});
