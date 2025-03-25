import { PreactDOMAttributes } from "preact";
import { Dispatch, StateUpdater, useCallback, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppMeta } from "lib/const";

export const meta: AppMeta = {
	hasCSS: true
};

// スマホ向け対応

const MAX_CODE = 0x10ffff;

export const App = () => {
	const [page, setPage] = useState(0);
	return (
		<BaseLayout scope="table-unicode" isCentering={true}>
			<h1>Unicode文字早見表</h1>
			<div class="flex">
				<p>
					<button popovertarget="select">表示範囲</button>
				</p>
				<p>
					{(2 ** 8 * page).toString(16).padStart(6, "0")}
					～
					{(2 ** 12 * (page + 1) - 1).toString(16).padStart(6, "0")}
				</p>
			</div>
			<SelectDialog page={page} setPage={setPage} />
			<table class="table-main">
				<thead>
					<tr>
						<th></th>
						{
							[...Array(16)].map((_, i) => (
								<th>{i.toString(16).toUpperCase()}</th>
							))
						}
					</tr>
				</thead>
				<tbody>
					{
						[...Array(2 ** 8)].map((_, i) => (
							<Row i={i + 2 ** 8 * page} />
						))
					}
				</tbody>
			</table>
			<h2>補足</h2>
			<ul>
				<li>セルをクリックで文字をコピー、Ctrl+クリックで文字コード(16進数)をコピーします</li>
			</ul>
		</BaseLayout>
	);
};

interface RowProps extends PreactDOMAttributes {
	i: number
}
const Row = (props: RowProps) => {
	const copyChar = useCallback((e: MouseEvent) => {
		if (!(e.currentTarget instanceof HTMLTableCellElement)) {
			return;
		}
		const text = e.currentTarget.textContent;
		if (text === null) {
			return;
		}

		const char = e.ctrlKey ? "0x" + text.codePointAt(0)?.toString(16) : text;
		if (typeof char === "undefined") {
			return;
		}
		window.navigator.clipboard.writeText(char);
	}, []);
	return (
		<tr>
			<th class="right">{props.i.toString(16).toUpperCase()}</th>
			{
				[...Array(16)].map((_, i) => (
					<td onClick={copyChar}>
						{String.fromCodePoint((props.i << 4) + i)}
					</td>
				))
			}
		</tr>
	);
};

interface SelectDialogProps extends PreactDOMAttributes {
	page: number
	setPage: Dispatch<StateUpdater<number>>

}
const SelectDialog = (props: SelectDialogProps) => {
	const changePage = useCallback((n: number) => props.setPage(n), []);
	return (
		<div popover id="select"><table>
			{[...Array((MAX_CODE >>> 16) + 1)].map((_, i) => (<tr>
				{[...Array(16)].map((_, j) => (
					<td class={(i << 4) + j === props.page ? "current" : ""}>
						<button
							popovertarget="select"
							popovertargetaction="hide"
							onClick={() => changePage((i << 4) + j)}>
							{((i << 4) + j).toString(16)
								.toUpperCase().padStart(3, "0")}
						</button>
					</td>
				))}
			</tr>))}
		</table></div>
	);
};
