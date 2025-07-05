import * as fs from "node:fs";
import * as path from "node:path";
import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "../utils";
import { importCommands } from "./import-command";

vi.mock("node:fs");
vi.mock("node:path");
vi.mock("../utils");
vi.mock("@clack/prompts", () => ({
	outro: vi.fn(),
	log: {
		error: vi.fn(),
	},
}));

describe("importCommands", () => {
	beforeEach(() => {
		vi.mocked(fs.existsSync).mockReset();
		vi.mocked(fs.readFileSync).mockReset();
		vi.mocked(fs.writeFileSync).mockReset();
		vi.mocked(path.resolve).mockReset();
		vi.mocked(p.outro).mockReset();
		vi.mocked(p.log.error).mockReset();
		vi.mocked(readFile).mockReset();
	});

	it("should import new groups and merge existing ones", async () => {
		const existingData = [{ title: "git", commands: ["git status"] }];
		const importData = [
			{ title: "git", commands: ["git push"] },
			{ title: "docker", commands: ["docker ps"] },
		];
		const importFilePath = "import.json";
		const resolvedPath = "/resolved/path/import.json";

		vi.mocked(path.resolve).mockReturnValue(resolvedPath);
		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(importData));
		vi.mocked(readFile).mockReturnValue(existingData);

		await importCommands(importFilePath);

		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);

		expect(writtenData).toEqual([
			{ title: "git", commands: ["git status", "git push"] },
			{ title: "docker", commands: ["docker ps"] },
		]);
		expect(p.outro).toHaveBeenCalledWith(
			expect.stringContaining("Import successful!"),
		);
	});

	it("should show an error if the import file does not exist", async () => {
		const importFilePath = "nonexistent.json";
		const resolvedPath = "/resolved/path/nonexistent.json";
		vi.mocked(path.resolve).mockReturnValue(resolvedPath);
		vi.mocked(fs.existsSync).mockReturnValue(false);

		await importCommands(importFilePath);

		expect(fs.writeFileSync).not.toHaveBeenCalled();
		expect(p.log.error).toHaveBeenCalledWith(
			expect.stringContaining("file does not exist"),
		);
	});

	it("should handle importing into an empty existing data file", async () => {
		const importData = [{ title: "docker", commands: ["docker ps"] }];
		const importFilePath = "import.json";
		const resolvedPath = "/resolved/path/import.json";

		vi.mocked(path.resolve).mockReturnValue(resolvedPath);
		vi.mocked(fs.existsSync).mockImplementation((p) => p === resolvedPath); // Only import file exists
		vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(importData));
		vi.mocked(readFile).mockReturnValue([]); // No existing data

		await importCommands(importFilePath);
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);
		expect(writtenData).toEqual(importData);
	});
});
