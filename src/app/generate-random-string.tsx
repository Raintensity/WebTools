import { PreactDOMAttributes } from "preact";
import { Dispatch, StateUpdater, useCallback, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";

export const meta: AppModuleMeta = {
	hasCSS: true,
	title: "ランダム文字列生成",
	description: "任意の文字でランダムな文字列を生成"
};

export const App = () => {
	const [chars, setChars] = useState(DEFAULT.input.check.reduce((a, c) => a + CHARS[(c as DefinedChars)], ""));
	const [format, setFormat] = useState(Array(DEFAULT.output.length).fill("R").join(""));
	const [results, setResults] = useState([] as string[]);

	const generate = useCallback(() => {
		if (chars === "" || format === "") {
			return;
		}
		setResults(a => [generateString(chars, format), ...a].slice(0, 10));
	}, [chars, format]);

	return (
		<BaseLayout scope="generate-random-string" isCentering={true}>
			<h1>ランダム文字列生成</h1>
			<div class="flex-pc">
				<div>
					<h2>使用する文字を選択</h2>
					<CharsForm setChars={setChars} />
				</div>
				<div>
					<h2>生成する書式を指定</h2>
					<OutputForm setFormat={setFormat} />
				</div>
				<div>
					<h2>生成</h2>
					<p><input type="button" value="生成" onClick={generate} /></p>
					<h2>生成結果(最新10件)</h2>
					<ResultList results={results} />
				</div>
			</div>
		</BaseLayout>
	);
};

const CHARS = {
	number: "0123456789",
	lower: "abcdefghijklmnopqrstuvwxyz",
	upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	symbol_min: "!@#$%^&*",
	symbol: "!\"#$%&'()-=^~\\|@`[]{};:+*,.<>/?_",
	hex: "0123456789ABCDEF",
	base32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
};
type DefinedChars = keyof typeof CHARS;

const DEFAULT = {
	input: {
		type: "check",
		check: ["number", "lower", "upper"],
		input: ""
	},
	output: {
		type: "fixed",
		length: 8
	}
};

const CHAR_SELECTOR: { [key: string]: string } = {
	number: "数字",
	lower: "英小文字",
	upper: "英大文字",
	symbol_min: "記号(!@#$%^&*)",
	symbol: "全記号"
};

interface CharsFormProps extends PreactDOMAttributes {
	setChars: Dispatch<StateUpdater<string>>
}
const CharsForm = (props: CharsFormProps) => {
	const [type, setType] = useState(DEFAULT.input.type);
	const [check, setCheck] = useState(DEFAULT.input.check as string[]);
	const [input, setInput] = useState(DEFAULT.input.input);

	const onInput = useCallback((e: Event) => {
		if (!(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		const name = e.currentTarget.name;
		const value = e.currentTarget.value;
		if (name === "input_type") {
			setType(value);
			if (value === "check") {
				let arr: string[] = [];
				setCheck(c => { arr = c; return c });
				props.setChars(arr.reduce((a, c) => a + CHARS[(c as DefinedChars)], ""));
			} else if (value === "input") {
				let str: string = "";
				setInput(c => { str = c; return c });
				props.setChars(str);
			} else {
				props.setChars(CHARS[(value as DefinedChars)]);
			}
		} else if (name === "check") {
			let arr: string[] = [];
			if (e.currentTarget.checked) {
				setCheck(c => {
					if (value === "symbol_min") {
						arr = [...c, value].filter(a => a !== "symbol");
					} else if (value === "symbol") {
						arr = [...c, value].filter(a => a !== "symbol_min");
					} else {
						arr = [...c, value];
					}
					return arr;
				});
			} else {
				setCheck(c => { arr = c.filter(i => i !== value); return arr });
			}
			props.setChars(arr.reduce((a, c) => a + CHARS[(c as DefinedChars)], ""));
		} else if (name === "input_input") {
			setInput(value);
			props.setChars(value);
		}
	}, []);

	return (
		<dl>
			<dt>
				<label>
					<input type="radio" name="input_type" value="check"
						checked={type === "check"} onInput={onInput} />
					チェックボックスから選択
				</label>
			</dt>
			<dd>
				{
					Object.keys(CHAR_SELECTOR).map(e => (
						<label>
							<input type="checkbox" name="check" value={e}
								checked={check.includes(e)} onInput={onInput}
								disabled={type !== "check"} />
							{CHAR_SELECTOR[e]}
						</label>
					))
				}
			</dd>
			<dt>
				<label>
					<input type="radio" name="input_type" value="hex"
						checked={type === "hex"} onInput={onInput} />
					16進数
				</label>
			</dt>
			<dt>
				<label>
					<input type="radio" name="input_type" value="base32"
						checked={type === "base32"} onInput={onInput} />
					Base32
				</label>
			</dt>
			<dt>
				<label>
					<input type="radio" name="input_type" value="base64"
						checked={type === "base64"} onInput={onInput} />
					Base64
				</label>
			</dt>
			<dt>
				<label>
					<input type="radio" name="input_type" value="input"
						checked={type === "input"} onInput={onInput} />
					文字を直接指定
				</label>
			</dt>
			<dd>
				<input type="text" name="input_input" value={input} onInput={onInput}
					disabled={type !== "input"} />
			</dd>
		</dl>
	);
};

interface OutputFormProps extends PreactDOMAttributes {
	setFormat: Dispatch<StateUpdater<string>>
}
const OutputForm = (props: OutputFormProps) => {
	const [type, setType] = useState(DEFAULT.output.type);
	const [length, setLength] = useState(DEFAULT.output.length);

	const onInputLength = useCallback((e: Event) => {
		if (!(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		if (e.currentTarget.value === "") {
			return;
		}

		const len = parseInt(e.currentTarget.value);
		if (len < 0) {
			return;
		}

		setLength(len);
		props.setFormat(Array(len).fill("R").join(""));
	}, []);
	return (
		<dl>
			<dt>
				<label>
					<input type="radio" name="output_type" value="fixed"
						checked={type === "fixed"} />
					固定桁
				</label>
			</dt>
			<dd>
				<input type="number" name="length" value={length}
					inputmode="numeric" min="1"
					disabled={type !== "fixed"} onInput={onInputLength} />
			</dd>
		</dl>
	);
};

interface ResultListProps extends PreactDOMAttributes {
	results: string[]
}
const ResultList = (props: ResultListProps) => {
	return (
		<ul>
			{props.results.map(i => <li>{i}</li>)}
		</ul>
	);
};

const generateString = (chars: string, format: string) => {
	return [...format].map(c => {
		if (c === "R") {
			return chars.charAt(~~(Math.random() * chars.length));
		} else {
			return c;
		}
	}).join("");
};
