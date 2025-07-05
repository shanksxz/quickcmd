import * as fs from "node:fs";
import * as path from "node:path";
import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportCommands } from "./export-command";

vi.mock("node:fs");
vi.mock("node:path");
vi.mock("@clack/prompts", () => ({
	outro: vi.fn(),
	log: {
		warn: vi.fn(),
	},
	cancel: vi.fn(),
}));

describe("exportCommands", () => {
	beforeEach(() => {
		vi.mocked(fs.existsSync).mockReset();
		vi.mocked(fs.readFileSync).mockReset();
		vi.mocked(fs.writeFileSync).mockReset();
		vi.mocked(path.resolve).mockReset();
		vi.mocked(p.outro).mockClear();
		vi.mocked(p.log.warn).mockClear();
	});

	it("should export commands to a specified file", () => {
		const mockData = JSON.stringify([
			{ title: "test", commands: ["test cmd"] },
		]);
		const mockFilePath = "my-commands.json";
		const resolvedPath = "/resolved/path/my-commands.json";

		vi.mocked(fs.existsSync).mockReturnValue(true);
		vi.mocked(fs.readFileSync).mockReturnValue(mockData);
		vi.mocked(path.resolve).mockReturnValue(resolvedPath);

		exportCommands(mockFilePath);

		expect(path.resolve).toHaveBeenCalledWith(mockFilePath);
		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		expect(fs.writeFileSync).toHaveBeenCalledWith(resolvedPath, mockData);
		expect(p.outro).toHaveBeenCalledWith(
			expect.stringContaining(
				`Commands successfully exported to ${resolvedPath}`,
			),
		);
	});

	it("should show a warning if no data file exists", () => {
		vi.mocked(fs.existsSync).mockReturnValue(false);

		exportCommands("my-commands.json");

		expect(fs.writeFileSync).not.toHaveBeenCalled();
		expect(p.log.warn).toHaveBeenCalledWith(
			"No commands to export. The data file does not exist.",
		);
	});
});
