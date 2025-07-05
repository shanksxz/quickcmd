import * as fs from "node:fs";
import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CommandData } from "../types";
import { readFile } from "../utils";
import { removeCommand } from "./remove-command";

vi.mock("node:fs");
vi.mock("../utils");
vi.mock("@clack/prompts", () => ({
	multiselect: vi.fn(),
	confirm: vi.fn(),
	cancel: vi.fn(),
	isCancel: vi.fn((val) => val === Symbol.for("clack.cancel")),
	outro: vi.fn(),
}));

describe("removeCommand", () => {
	const MOCK_DATA = [
		{ title: "git", commands: ["git status", "git push"] },
		{ title: "docker", commands: ["docker ps"] },
	];

	beforeEach(() => {
		vi.mocked(readFile).mockReturnValue(JSON.parse(JSON.stringify(MOCK_DATA)));
		vi.mocked(fs.writeFileSync).mockClear();
		vi.mocked(p.multiselect).mockClear();
		vi.mocked(p.confirm).mockClear();
		vi.mocked(p.cancel).mockClear();
	});

	it("should remove a single selected command from a group", async () => {
		vi.mocked(p.multiselect).mockResolvedValue(["git status"]);

		await removeCommand("git");

		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);
		expect(writtenData[0].commands).toEqual(["git push"]);
	});

	it("should remove the entire group if all commands are selected", async () => {
		vi.mocked(p.multiselect).mockResolvedValue(["git status", "git push"]);
		vi.mocked(p.confirm).mockResolvedValue(true);

		await removeCommand("git");

		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);
		expect(
			writtenData.find((g: CommandData) => g.title === "git"),
		).toBeUndefined();
	});

	it("should do nothing if user cancels the selection", async () => {
		vi.mocked(p.multiselect).mockResolvedValue(Symbol.for("clack.cancel"));
		await removeCommand("git");
		expect(fs.writeFileSync).not.toHaveBeenCalled();
		expect(p.cancel).toHaveBeenCalledWith("Operation cancelled");
	});

	it("should do nothing if user cancels deleting the whole group", async () => {
		vi.mocked(p.multiselect).mockResolvedValue(["git status", "git push"]);
		vi.mocked(p.confirm).mockResolvedValue(false);
		await removeCommand("git");
		expect(fs.writeFileSync).not.toHaveBeenCalled();
		expect(p.cancel).toHaveBeenCalledWith("Operation cancelled");
	});
});
