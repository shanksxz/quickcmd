import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "../utils";
import { searchCommands } from "./search-command";

vi.mock("../utils");
vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	outro: vi.fn(),
	log: {
		info: vi.fn(),
		warn: vi.fn(),
	},
}));

describe("searchCommands", () => {
	const MOCK_DATA = [
		{ title: "git", commands: ["git status", "git push"] },
		{ title: "docker", commands: ["docker-compose up"] },
	];
	const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

	beforeEach(() => {
		vi.mocked(readFile).mockReturnValue(MOCK_DATA);
		logSpy.mockClear();
		vi.mocked(p.intro).mockClear();
		vi.mocked(p.outro).mockClear();
		vi.mocked(p.log.info).mockClear();
	});

	it("should find commands by matching keyword in title", async () => {
		await searchCommands("git");
		expect(p.intro).toHaveBeenCalled();
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("git status"));
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("git push"));
		expect(logSpy).not.toHaveBeenCalledWith(
			expect.stringContaining("docker-compose up"),
		);
	});

	it("should find commands by matching keyword in command", async () => {
		await searchCommands("compose");
		expect(p.intro).toHaveBeenCalled();
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining("docker-compose up"),
		);
		expect(logSpy).not.toHaveBeenCalledWith(expect.stringContaining("git"));
	});

	it("should show an info message if no commands are found", async () => {
		await searchCommands("nonexistent");
		expect(p.intro).not.toHaveBeenCalled();
		expect(p.log.info).toHaveBeenCalledWith(
			expect.stringContaining("No commands found matching 'nonexistent'"),
		);
	});
});
