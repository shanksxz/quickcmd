import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "../utils";
import { getCommands } from "./get-command";

vi.mock("../utils");
vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	outro: vi.fn(),
	log: {
		warn: vi.fn(),
	},
}));

describe("getCommands", () => {
	const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

	beforeEach(() => {
		vi.mocked(readFile).mockReset();
		vi.mocked(p.intro).mockClear();
		vi.mocked(p.outro).mockClear();
		vi.mocked(p.log.warn).mockClear();
		logSpy.mockClear();
	});

	it("should display commands for a specific title", () => {
		const MOCK_DATA = [{ title: "git", commands: ["git status", "git push"] }];
		vi.mocked(readFile).mockReturnValue(MOCK_DATA);

		getCommands("git");

		expect(p.intro).toHaveBeenCalledWith(
			expect.stringContaining("Commands for 'git':"),
		);
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("git status"));
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("git push"));
		expect(p.outro).toHaveBeenCalledWith(expect.stringContaining("Done."));
	});

	it("should show a warning if the title does not exist", () => {
		const MOCK_DATA = [{ title: "git", commands: ["git status"] }];
		vi.mocked(readFile).mockReturnValue(MOCK_DATA);

		getCommands("docker");

		expect(p.log.warn).toHaveBeenCalledWith(
			expect.stringContaining('No commands found with title "docker"'),
		);
	});
});
