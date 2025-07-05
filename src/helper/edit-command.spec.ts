import * as fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "../utils";
import { editCommand } from "./edit-command";

vi.mock("node:fs");
vi.mock("../utils");

describe("editCommand", () => {
	beforeEach(() => {
		vi.mocked(fs.writeFileSync).mockClear();
	});

	it("should edit a specific command in a group", () => {
		const MOCK_DATA = [{ title: "git", commands: ["git status", "git pull"] }];
		vi.mocked(readFile).mockReturnValue(JSON.parse(JSON.stringify(MOCK_DATA)));

		editCommand("git", 2, "git pull --rebase");

		expect(fs.writeFileSync).toHaveBeenCalledOnce();
		const writtenData = JSON.parse(
			vi.mocked(fs.writeFileSync).mock.calls[0][1] as string,
		);
		expect(writtenData[0].commands[1]).toBe("git pull --rebase");
	});

	it("should not modify data if title does not exist", () => {
		const MOCK_DATA = [{ title: "git", commands: ["git status"] }];
		vi.mocked(readFile).mockReturnValue(JSON.parse(JSON.stringify(MOCK_DATA)));

		editCommand("docker", 0, "docker ps");

		expect(fs.writeFileSync).not.toHaveBeenCalled();
	});
});
