import { PreactDOMAttributes } from "preact";
import { useCallback, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppMeta } from "lib/const";
import { DateEx, zPad } from "lib/util";

export const meta: AppMeta = {
	hasCSS: true
};

export const App = () => {
	const [date, setDate] = useState(new Date);

	const onInputDate = useCallback((e: InputEvent) => {
		if (!(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		if (e.currentTarget.valueAsDate) {
			setDate(new Date(e.currentTarget.valueAsDate));
		}
	}, []);

	return (
		<BaseLayout scope="table-age" isCentering={true}>
			<h1>年齢早見表</h1>
			<div>
				<p>
					<label>
						基準日:
						<input type="date"
							value={format(date)}
							onInput={onInputDate} />
					</label>
				</p>
			</div>
			<table>
				<colgroup>
					<col style={{ width: "55px" }} />
				</colgroup>
				<thead>
					<tr><th>年齢</th><th colspan={3}>生年月日</th></tr>
				</thead>
				<tbody>
					{
						[...Array(151)].map((_, i) => (<Row i={i} date={date} />))
					}
				</tbody>
			</table>
			<h2>ご注意</h2>
			<ul>
				<li>日本の法律上の年齢計算は、上記結果に対して-1日します</li>
			</ul>
		</BaseLayout>
	);
};

interface RowProps extends PreactDOMAttributes {
	i: number
	date: Date
}
const Row = (props: RowProps) => {
	const begin = new Date(props.date.getTime());
	begin.setFullYear(begin.getFullYear() - 1 - props.i);
	if (props.date.getMonth() === begin.getMonth()) {
		begin.setDate(begin.getDate() + 1);
	}
	const end = new Date(props.date.getTime());
	end.setFullYear(end.getFullYear() - props.i);
	return (
		<tr>
			<td class="right">{props.i}</td>
			<td>
				{viewFormat(begin)}
			</td>
			<td>
				～
			</td>
			<td>
				{viewFormat(end)}
			</td>
		</tr>
	);
};

const format = (date: Date) => {
	return zPad(date.getFullYear(), 4)
		+ "-"
		+ zPad(date.getMonth() + 1, 2)
		+ "-"
		+ zPad(date.getDate(), 2);
};

const getJPYear = (date: Date) => {
	const imperial = DateEx.IMPERIAL_JP.toReversed().find(a => a.begin < date);
	if (!imperial) {
		return "";
	}
	const year = date.getFullYear() - imperial.begin.getFullYear() + 1;
	return imperial.name + (year === 1 ? "元" : year);
};
const viewFormat = (date: Date) => {
	const jpYear = getJPYear(date)
	return zPad(date.getFullYear(), 4)
		+ (jpYear ? "(" + jpYear + ")" : "")
		+ "年"
		+ zPad(date.getMonth() + 1, 2)
		+ "月"
		+ zPad(date.getDate(), 2)
		+ "日";
};
