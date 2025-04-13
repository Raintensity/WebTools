import { PreactDOMAttributes } from "preact";
import { Dispatch, StateUpdater, useCallback, useRef, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppMeta } from "lib/const";

export const meta: AppMeta = {
	hasCSS: true
};

export const App = () => {
	const [hash, setHash] = useState(EMPTY_DATA);

	return (
		<BaseLayout scope="convert-hash" isCentering={true}>
			<h1>ハッシュ計算</h1>
			<div class="flex-pc">
				<div>
					<h2>入力</h2>
					<InputForm setHash={setHash} />
				</div>
				<div>
					<h2>結果</h2>
					<OutputForm hash={hash} />
				</div>
			</div>
			<h2>ご注意</h2>
			<ul>
				<li>テキスト入力欄の改行はLFとみなされます。</li>
			</ul>
		</BaseLayout>
	);
};

interface HashData {
	"sha-1": string
	"sha-256": string
	"sha-384": string
	"sha-512": string
}
const EMPTY_DATA: HashData = {
	"sha-1": "",
	"sha-256": "",
	"sha-384": "",
	"sha-512": ""
};

interface InputFormProps extends PreactDOMAttributes {
	setHash: Dispatch<StateUpdater<HashData>>
}
const InputForm = (props: InputFormProps) => {
	const [type, setType] = useState("text");
	const tempRef = useRef(EMPTY_DATA);

	const changeType = useCallback((e: Event) => {
		if (!e.currentTarget || !(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		setType(e.currentTarget.value);
		props.setHash(b => {
			[b, tempRef.current] = [tempRef.current, b];
			return b;
		});
	}, []);

	const onInput = async (e: InputEvent) => {
		if (type !== "text") return;
		const elem = e.currentTarget;
		if (!elem || !(elem instanceof HTMLTextAreaElement)) {
			return;
		}
		props.setHash(await calcDigestText(elem.value));
	};

	const onChange = async (e: Event) => {
		if (type !== "file") return;
		const elem = e.currentTarget;
		if (!elem || !(elem instanceof HTMLInputElement) || !elem.files?.length) {
			return;
		}
		props.setHash(await calcDigest(await elem.files[0].arrayBuffer()));
	};

	return (
		<dl>
			<dt>
				<label>
					<input type="radio" name="type" value="file"
						checked={type === "file"} onInput={changeType} />
					ファイルのハッシュを計算
				</label>
			</dt>
			<dd>
				<input type="file" disabled={type !== "file"}
					onChange={onChange} />
			</dd>
			<dt>
				<label>
					<input type="radio" name="type" value="text"
						checked={type === "text"} onInput={changeType} />
					テキストのハッシュを計算
				</label>
			</dt>
			<dd>
				<textarea disabled={type !== "text"} onInput={onInput}></textarea>
			</dd>
		</dl>
	);
};

const calcDigest = async (data: ArrayBuffer): Promise<HashData> => {
	return {
		"sha-1": toHex(await crypto.subtle.digest("sha-1", data)),
		"sha-256": toHex(await crypto.subtle.digest("sha-256", data)),
		"sha-384": toHex(await crypto.subtle.digest("sha-384", data)),
		"sha-512": toHex(await crypto.subtle.digest("sha-512", data))
	};
};

const calcDigestText = async (text: string) => {
	// @ts-ignore: TextEncoder is not yet compatible generics type on TypeScript.
	return await calcDigest(new TextEncoder().encode(text));
};

const toHex = (data: ArrayBuffer) =>
	[...new Uint8Array(data)].map(b => b.toString(16).padStart(2, "0")).join("");

interface OutputFormProps extends PreactDOMAttributes {
	hash: HashData
}
const OutputForm = (props: OutputFormProps) => {
	const [upper, setUpper] = useState(false);
	const toggleUpper = useCallback(() => setUpper(b => !b), []);
	return (<>
		<p>
			<label>
				<input type="checkbox" onInput={toggleUpper} />
				A～F(10～15)を大文字で表示
			</label>
		</p>
		<dl>
			<dt>SHA-1</dt>
			<dd>{upper ? props.hash["sha-1"].toUpperCase() : props.hash["sha-1"]}</dd>
			<dt>SHA-256</dt>
			<dd>{upper ? props.hash["sha-256"].toUpperCase() : props.hash["sha-256"]}</dd>
			<dt>SHA-384</dt>
			<dd>{upper ? props.hash["sha-384"].toUpperCase() : props.hash["sha-384"]}</dd>
			<dt>SHA-512</dt>
			<dd>{upper ? props.hash["sha-512"].toUpperCase() : props.hash["sha-512"]}</dd>
		</dl>
	</>);
};
