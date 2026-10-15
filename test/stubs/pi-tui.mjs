// Stand-in for Pi's bundled @earendil-works/pi-tui. Keys are sent as their
// names ("enter", "tab", "2"), so matchesKey is plain equality.
export const Key = {
	escape: "escape",
	enter: "enter",
	tab: "tab",
	up: "up",
	down: "down",
	left: "left",
	right: "right",
	shift: (key) => `shift+${key}`,
};

export const matchesKey = (data, key) => data === key;
export const truncateToWidth = (text) => text;
export const visibleWidth = (text) => text.length;
export const wrapTextWithAnsi = (text) => [text];

export class Editor {
	text = "";
	focused = false;
	setText(text) { this.text = text; }
	handleInput(data) {
		if (data === "enter") this.onSubmit?.(this.text);
		else this.text += data;
	}
	render() { return [this.text]; }
	invalidate() {}
}

export class Text {
	constructor(text) { this.text = text; }
}
