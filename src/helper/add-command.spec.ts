import * as fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addCommands } from "./add-command";

vi.mock("node:fs");

describe("addCommands", () => {
	const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

	beforeEach(() => {
		// Reset mocks before each test
		vi.mocked(fs.existsSync).mockReset();
		vi.mocked(fs.readFileSync).mockReset();
		vi.mocked(fs.writeFileSync).mockReset();
		logSpy.mockClear();
	});

	it("should add a new command group if one does not exist", () => {
		vi.mocked(fs.existsSync).mockReturnValue(false);

		addCommands("new-group", "new-command");

		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);
		expect(writtenData).toEqual([
			{ title: "new-group", commands: ["new-command"] },
		]);
		expect(logSpy).toHaveBeenCalledWith("Command saved successfully");
	});

	it("should add a command to an existing group", () => {
		const existingData = [{ title: "git", commands: ["git status"] }];
		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(existingData));

		addCommands("git", "git push");

		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);
		expect(writtenData).toEqual([
			{ title: "git", commands: ["git status", "git push"] },
		]);
		expect(logSpy).toHaveBeenCalledWith("Command saved successfully");
	});

	it("should not add a command if it already exists", () => {
		const existingData = [{ title: "git", commands: ["git status"] }];
		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(existingData));

		addCommands("git", "git status");

		expect(fs.writeFileSync).not.toHaveBeenCalled();
		expect(logSpy).toHaveBeenCalledWith(
			expect.stringContaining("already exists for"),
		);
	});

	it("should not add a command if fields are empty", () => {
		addCommands("", "");
		expect(fs.writeFileSync).not.toHaveBeenCalled();
		expect(logSpy).toHaveBeenCalledWith("Fields cannot be empty");
	});
});
