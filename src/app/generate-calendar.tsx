import { useCallback, useState } from "preact/hooks";
import { AppModuleMeta } from "lib/const";
import { DateEx } from "lib/util";
import { isJPHoliday } from "lib/holiday";

export const meta: AppModuleMeta = {
	minimalGlobalHeader: true,
	title: "カレンダー生成",
	description: "指定年月のカレンダーを生成",
	hasCSS: true
};

export const App = () => {
	const [date, setDate] = useState(initialDate());

	const addMonth = useCallback((n: number) => {
		setDate(p => {
			const d = p.clone();
			d.setUTCMonth(d.getUTCMonth() + n);
			d.setUTCDate(1);
			return d;
		});
	}, []);
	const onInput = useCallback((e: InputEvent) => {
		if (!e.currentTarget || !(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		const val = Date.parse(e.currentTarget.value);
		if (Number.isNaN(val)) return;
		setDate(new DateEx(val));
	}, []);

	const eoDate = date.clone();
	eoDate.setUTCMonth(eoDate.getUTCMonth() + 1);
	eoDate.setUTCDate(0);
	const days = [
		...Array(date.getDay()),
		...[...Array(eoDate.getUTCDate())].map((_, i) => i + 1),
		...Array(6 - eoDate.getDay())
	];

	const cd = date.clone();
	cd.setUTCDate(cd.getUTCDate() - cd.getUTCDay() - 1);
	return (
		<div data-scope="generate-calendar">
			<div>
				<p><input type="button" value="<<"
					onClick={() => addMonth(-1)} /></p>
				<p><input type="month" onInput={onInput}
					value={date.formatWithOffset("yyyy-MM")} /></p>
				<p><input type="button" value=">>"
					onClick={() => addMonth(1)} /></p>
			</div>
			<table>
				<thead>
					<tr>
						{DateEx.DAYS_JP.map((e, i) => (
							<th class={i === 0 ? "sun" : i === 6 ? "sat" : ""}>
								{e}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{[...Array(Math.ceil(days.length / 7))].map((_, w) => (
						<tr>
							{[...Array(7)].map((_, d) => {
								let cls = "";
								if (d === 6) cls = "sat";
								if (d === 0) cls = "sun";

								cd.setUTCDate(cd.getUTCDate() + 1);
								if (isJPHoliday(cd)) cls = "sun";
								return (
									<td class={cls}>
										<p class="day">{days[w * 7 + d]}</p>
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const initialDate = () => {
	const d = new DateEx(Math.floor(Date.now() / 86400000) * 86400000);
	d.setUTCDate(1);
	return d;
};
