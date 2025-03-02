import { PreactDOMAttributes, RefObject } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";

export const meta: AppModuleMeta = {
	hasCSS: true,
	title: "文字列エンコーダ・デコーダ",
	description: "Base64やURL等の形式にエンコード・デコード"
};

export const App = () => {
	const [iType, setIType] = useState("raw");
	const [oType, setOType] = useState("base64");
	const [iStr, setIStr] = useState("");
	const [oStr, setOStr] = useState("");

	const iTypeRef = useRef<HTMLSelectElement>(null);
	const oTypeRef = useRef<HTMLSelectElement>(null);
	const iStrRef = useRef<HTMLTextAreaElement>(null);
	const oStrRef = useRef<HTMLTextAreaElement>(null);

	const onInput = useCallback((e: InputEvent) => {
		if (!e.currentTarget) {
			return;
		}
		if (!iTypeRef.current || !oTypeRef.current || !iStrRef.current) {
			return;
		}

		if (e.currentTarget === iTypeRef.current) {
			setIType(iTypeRef.current.value);
		} else if (e.currentTarget === oTypeRef.current) {
			setOType(oTypeRef.current.value);
		} else if (e.currentTarget === iStrRef.current) {
			setIStr(iStrRef.current.value);
		}
	}, [iTypeRef, oTypeRef, iStrRef]);

	const outputToInput = useCallback(() => {
		if (!iStrRef.current || !oStrRef.current) {
			return;
		}
		setIStr(oStrRef.current.value);
	}, [iStrRef, oStrRef]);

	const copyToClipboard = useCallback(() => {
		if (!oStrRef.current) {
			return;
		}
		window.navigator.clipboard.writeText(oStrRef.current.value);
	}, [oStrRef]);

	useEffect(() => {
		if (!iTypeRef.current || !oTypeRef.current || !iStrRef.current) {
			return;
		}

		let data: string;
		try {
			const decoder = ENCODER[iTypeRef.current.value];
			data = decoder.decode(iStrRef.current.value);

			const encoder = ENCODER[oTypeRef.current.value];
			setOStr(encoder.encode(data));
		} catch {
			setOStr("入力データが正しくありません");
			return;
		}
	}, [iType, oType, iStr]);

	return (
		<BaseLayout scope="convert-encdec-string" isCentering={true}>
			<h1>文字列エンコーダ・デコーダ</h1>
			<div class="flex-pc">
				<div>
					<h2>入力</h2>
					<p>
						<Selector value={iType} onInput={onInput} sRef={iTypeRef} />
					</p>
					<p>
						<textarea onInput={onInput} ref={iStrRef} value={iStr} />
					</p>
				</div>
				<div>
					<h2>結果</h2>
					<p>
						<Selector value={oType} onInput={onInput} sRef={oTypeRef} />
						<input
							type="button"
							value="結果を入力へ"
							onClick={outputToInput} />
						<input
							type="button"
							value="コピー"
							onClick={copyToClipboard} />
					</p>
					<p>
						<textarea
							readOnly
							value={oStr}
							ref={oStrRef}
							onFocus={e => e.currentTarget.select()} />
					</p>
				</div>
			</div>
		</BaseLayout>
	);
};

const ENCODER: {
	[type: string]: {
		name: string
		encode: (data: string) => string
		decode: (data: string) => string
	}
} = {
	raw: {
		name: "テキスト",
		encode: data => data,
		decode: data => data
	},
	base64: {
		name: "Base64",
		encode(data) {
			const str = [...new TextEncoder().encode(data)]
				.map(c => String.fromCharCode(c))
				.join("");
			return window.btoa(str);
		},
		decode(data) {
			return new TextDecoder().decode(Uint8Array.from(window.atob(data), c => {
				const code = c.codePointAt(0);
				if (code === undefined) throw new Error("Unknown error");
				return code;
			}));
		}
	},
	url: {
		name: "URLエンコード",
		encode(data) {
			return window.encodeURIComponent(data);
		},
		decode(data) {
			return window.decodeURIComponent(data);
		}
	},
	htmlescape: {
		name: "HTMLエスケープ",
		encode(data) {
			return data.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;")
				.replaceAll("'", "&apos;")
				.replaceAll(`"`, "&quot;");
		},
		decode(data) {
			return data.replaceAll("&lt;", "<")
				.replaceAll("&gt;", ">")
				.replaceAll("&apos;", "'")
				.replaceAll("&quot;", `"`)
				.replaceAll("&amp;", "&");
		}
	}
};

interface SelectorProps extends PreactDOMAttributes {
	value: string
	sRef: RefObject<HTMLSelectElement>
	onInput: (e: InputEvent) => void
}
const Selector = (props: SelectorProps) => (
	<select value={props.value} onInput={props.onInput} ref={props.sRef}>
		{
			Object.keys(ENCODER).map(v => (
				<option value={v}>{ENCODER[v].name}</option>
			))
		}
	</select>
);
