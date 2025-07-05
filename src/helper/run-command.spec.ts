import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import * as p from "@clack/prompts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFile } from "../utils";
import { runCommand } from "./run-command";

vi.mock("../utils");
vi.mock("node:child_process");
vi.mock("@clack/prompts", () => ({
	select: vi.fn(),
	cancel: vi.fn(),
	isCancel: vi.fn((val) => val === Symbol.for("clack.cancel")),
	outro: vi.fn(),
	log: {
		warn: vi.fn(),
	},
}));

describe("runCommand", () => {
	const MOCK_DATA = [{ title: "git", commands: ["git status"] }];
	const spawnOnMock = vi.fn();

	beforeEach(() => {
		vi.mocked(readFile).mockReturnValue(MOCK_DATA);
		vi.mocked(p.select).mockClear();
		vi.mocked(p.cancel).mockClear();
		vi.mocked(p.outro).mockClear();
		vi.mocked(spawn).mockClear();
		spawnOnMock.mockClear();
		vi.mocked(spawn).mockReturnValue({
			on: spawnOnMock,
		} as unknown as ChildProcess);
	});

	it("should spawn the selected command", async () => {
		vi.mocked(p.select).mockResolvedValue("git status");

		await runCommand("git");

		expect(p.select).toHaveBeenCalledOnce();
		expect(spawn).toHaveBeenCalledOnce();
		expect(spawn).toHaveBeenCalledWith("git status", {
			stdio: "inherit",
			shell: true,
		});
		expect(p.outro).toHaveBeenCalledWith(
			expect.stringContaining("Executing: git status"),
		);
	});

	it("should handle user cancellation", async () => {
		vi.mocked(p.select).mockResolvedValue(Symbol.for("clack.cancel"));
		await runCommand("git");
		expect(spawn).not.toHaveBeenCalled();
		expect(p.cancel).toHaveBeenCalledWith("Operation cancelled.");
	});
});
