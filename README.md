# pi-heineck-questionnaire

A questionnaire tool for Pi: the agent asks you one or more multiple-choice questions, and
you answer from the keyboard. You can add context to any choice, and the last option
always lets you write your own answer. It started from Pi 1.0.4's
[questionnaire.ts example](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/examples/extensions/questionnaire.ts)
and is used with Pi 1.2.0 on Linux. It has no dependencies.

## Install

```sh
pi install git:github.com/Heineck66/pi-heineck-questionnaire
```

Run `/reload` in Pi, or start a new session. The agent then has a `questionnaire` tool.

Install it only once. Pi also loads any folder in `~/.pi/agent/extensions/` that has an
`index.ts`, and two copies register the same tool name twice. The same goes for Pi's own
questionnaire example, if you copied it there.

To remove it, run `pi remove git:github.com/Heineck66/pi-heineck-questionnaire`, then
`/reload`.

## Usage

The agent decides when to ask. You can nudge it: "ask me with the questionnaire before
you start". One question shows a plain list of options. Several questions show a tab bar,
one tab per question plus a Submit tab.

```
────────────────────────────────────────────────────────────
 ←  ■ Scope   □ Priority   ✓ Submit  →

 Which priority?

> 1. High
  2. Low
  3. None of these — type your own answer

 h/l or ←→ questions • j/k or ↑↓ options • 1–9/0 select •
 Tab add context • Enter confirm • Esc cancel
────────────────────────────────────────────────────────────
```

### Controls

- `j/k` or down/up: highlight options.
- `h/l` or left/right: move between questions and Submit; Shift-Tab moves backward.
- `1–9`: immediately choose that option; `0`: option 10. Use navigation + Enter for later options.
- `Tab`: edit context on the highlighted choice; `Enter`: save and advance.
- The final option always permits your own answer.
- Returning to a question highlights the saved answer, marks it `✓`, and shows saved context/custom text beneath it.
- Escape while editing discards that edit; Escape outside the editor cancels the questionnaire. Text keys work normally inside the editor.
- Single questions finish immediately after confirmation; multiple questions end with a review/Submit screen.

### What the agent gets back

One line per question, in question order:

```
Scope: user selected: 2. Large
Priority: user selected: 1. High
Additional context: urgent
Notes: user wrote: whatever you typed
```

If you cancel, the agent is told so, along with any answers you gave before cancelling.

### Notes

- The questionnaire needs Pi's terminal UI. In print, JSON, and RPC mode the tool returns
  an error instead of asking.
- **Herdr**: while the questionnaire is open, it emits `herdr:blocked`, so Herdr shows the
  pane as waiting for you.
- The tool's `allowOther` parameter, from Pi's example, is accepted and ignored: the
  custom-answer option is always shown.

## Development

To work on a clone, install it from its folder. Pi loads it in place, so `/reload` picks
up your edits:

```sh
pi install /path/to/pi-heineck-questionnaire
```

Run the tests from the clone:

```sh
npm test
```

The tests need Node 22.19 or newer, for its TypeScript support, and no npm install. They
drive the dialog with key presses through a mocked Pi and stand-ins for pi-tui and
typebox (`test/stubs/`).

## License

MIT. See [LICENSE](LICENSE), which also carries the MIT notice of Pi, whose example this
extension is based on.
