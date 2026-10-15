import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// Pi bundles these packages, so point the bare imports at local stand-ins.
const stubs = {
	"@earendil-works/pi-tui": new URL("./stubs/pi-tui.mjs", import.meta.url).href,
	typebox: new URL("./stubs/typebox.mjs", import.meta.url).href,
};
registerHooks({
	resolve: (specifier, context, next) =>
		stubs[specifier] ? { url: stubs[specifier], shortCircuit: true } : next(specifier, context),
});
const { default: questionnaire } = await import("../index.ts");

const questions = [
	{ id: "scope", label: "Scope", prompt: "Which scope?", options: [{ label: "Small" }, { label: "Large" }] },
	{ id: "prio", label: "Priority", prompt: "Which priority?", options: [{ label: "High" }, { label: "Low" }] },
];

// Starts the tool and returns the dialog component plus the pending result.
function open(qs = questions) {
	let tool;
	questionnaire({ registerTool: (t) => { tool = t; }, events: { emit() {} } });
	let component;
	const theme = { fg: (_c, s) => s, bg: (_c, s) => s, bold: (s) => s };
	const ctx = {
		mode: "tui",
		ui: { custom: (factory) => new Promise((done) => { component = factory({ requestRender() {} }, theme, {}, done); }) },
	};
	const result = tool.execute("call", { questions: qs }, undefined, undefined, ctx);
	const press = (...keys) => keys.forEach((key) => {
		component.handleInput(key);
		component.render(80);
	});
	return { press, text: async () => (await result).content[0].text };
}

test("number, context and revisit map to the options the user chose", { timeout: 1000 }, async () => {
	const { press, text } = open();
	press("2"); // Scope: Large
	press("tab", "urgent", "enter"); // Priority: High with context
	press("h", "h", "enter"); // Back to Scope; cursor restored on Large
	press("l", "enter"); // Priority keeps its context; then Submit
	assert.equal(
		await text(),
		"Scope: user selected: 2. Large\nPriority: user selected: 1. High\nAdditional context: urgent",
	);
});

test("answers follow question order, not answering order", { timeout: 1000 }, async () => {
	const { press, text } = open();
	press("l", "1"); // Priority first; advances to Submit
	press("l", "2"); // Wrap to Scope; advances to Priority
	press("l", "enter");
	assert.equal(await text(), "Scope: user selected: 2. Large\nPriority: user selected: 1. High");
});

test("custom answer is returned as written", { timeout: 1000 }, async () => {
	const { press, text } = open([questions[0]]);
	press("3", "enter"); // Blank custom answer is refused
	press("mine", "enter");
	assert.equal(await text(), "Scope: user wrote: mine");
});

test("cancelling keeps answers already given", { timeout: 1000 }, async () => {
	const { press, text } = open();
	press("1", "tab", "escape", "escape"); // Close the editor, then cancel
	assert.equal(
		await text(),
		"User cancelled the questionnaire. Answers given before cancelling:\nScope: user selected: 1. Small",
	);
});
