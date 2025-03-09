import { PreactDOMAttributes } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";

export const meta: AppModuleMeta = {
	hasCSS: true,
	title: "バイナリビューア",
	description: "バイナリファイルの内容を表示"
};

const rowHeight = 25;

export const App = () => {
	const [data, setData] = useState(new Uint8Array);
	const [lines, setLines] = useState(Math.ceil(window.innerHeight / rowHeight) + 11);
	const [offset, setOffset] = useState(0);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const onChange = useCallback(async (e: Event) => {
		if (!(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		if (!e.currentTarget.files?.length) {
			return;
		}
		setData(new Uint8Array(await e.currentTarget.files[0].arrayBuffer()));
	}, []);

	const onResize = useCallback(() => {
		if (!wrapperRef.current) {
			return;
		}
		setLines(Math.ceil(window.innerHeight / rowHeight) + 11);
	}, []);

	const onScroll = useCallback(() => {
		if (!wrapperRef.current) {
			setOffset(0);
			return;
		}
		const wPos = wrapperRef.current.offsetTop;
		const sPos = document.documentElement.scrollTop;
		const pos = Math.floor((sPos - wPos) / rowHeight) - 5;
		if (sPos - wPos <= 0 || pos <= 0) {
			setOffset(0);
		} else {
			setOffset(pos);
		}
	}, [wrapperRef]);

	useEffect(() => {
		window.addEventListener("resize", onResize);
		document.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("resize", onResize);
			document.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<BaseLayout scope="viewer-binary" isCentering={true}>
			<h1>バイナリビューア</h1>
			<div>
				<p>
					<label>
						ファイル:
						<input type="file" onChange={onChange} />
					</label>
				</p>
			</div>
			{data.length > 0 &&
				<div ref={wrapperRef} class="relative scroll-x-sp" style={{
					height: ((Math.ceil(data.length / 16) + 1) * rowHeight + 1) + "px"
				}}>
					<table class="absolute" style={{
						top: offset * rowHeight + "px"
					}}>
						<colgroup>
							<col style={{ width: "80px" }} />
							<col style={{ width: "45px" }} span={16} />
							<col style={{ width: "180px" }} />
						</colgroup>
						<thead>
							<tr>
								<th>Pos</th>
								{[...Array(16)].map((_, i) => (
									<th>{i.toString(16).toUpperCase()}</th>
								))}
								<th>String</th>
							</tr>
						</thead>
						<TableBody data={data} offset={offset} lines={lines} />
					</table>
				</div>
			}
			<h2>ご注意</h2>
			<ul>
				<li>処理速度はお使いのPCやブラウザの処理能力に依存します。仮想スクロールを採用しているため、ある程度は耐えられる設計ですが、あまりにも大きいサイズのファイルを読み込むとフリーズする可能性があります。</li>
				<li>右側のプレビューでは、0x09(HT:水平タブ)、0x0A(LF:改行)、0x0C(FF:書式送り)、0x0D(CR:復帰)、0xAD(SHY:ソフトハイフン)は0x20(空白文字)に置き換えます。</li>
				<li>使用フォント: <a href="https://monaspace.githubnext.com/" target="_blank" rel="noopener noreferrer">Monaspace Neon</a>をカスタムしたもの</li>
			</ul>
		</BaseLayout>
	);
};

interface TableBodyProps extends PreactDOMAttributes {
	data: Uint8Array
	offset: number
	lines: number
}
const TableBody = (props: TableBodyProps) => {
	const rows = Math.min(props.lines, Math.ceil(props.data.length / 16) - props.offset);
	const digit = ((props.data.length - 1) >> 4).toString(16).length;
	return (
		<tbody>
			{[...Array(rows)].map((_, i) => (
				<tr>
					<th>{(i + props.offset).toString(16).padStart(digit, "0")}</th>
					{[...Array(16)].map((_, j) => (
						<td>
							{
								props.data.at(((i + props.offset) << 4) + j)
									?.toString(16)
									.padStart(2, "0")
									.toUpperCase()
							}
						</td>
					))}
					<td class="left">
						{[...Array(16)].map((_, j) => {
							const char = props.data.at(((i + props.offset) << 4) + j);
							if (typeof char !== "undefined") {
								if (char === 0x09 || char === 0x0a || char === 0x0c
									|| char === 0x0d || char === 0xad) {
									return String.fromCharCode(0x20);
								}
								return String.fromCharCode(char);
							}
						})}
					</td>
				</tr>
			))}
		</tbody>
	);
};
