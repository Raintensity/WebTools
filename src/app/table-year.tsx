import { useCallback, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";
import { getJPHolidays } from "lib/holiday";
import { DateEx, IMPERIAL_JP } from "lib/util";

export const meta: AppModuleMeta = {
	hasCSS: true,
	title: "年情報",
	description: "指定年の平日・休日日数や祝日の早見を生成"
};

type Month = { m: number, d: number, wd: number, hd: number };
export const App = () => {
	const [year, setYear] = useState(
		new Date(Math.floor(Date.now() / 86400000) * 86400000).getUTCFullYear()
	);

	const onInput = useCallback((e: InputEvent) => {
		if (!(e.currentTarget instanceof HTMLInputElement)) {
			return;
		}
		if (!Number.isNaN(parseInt(e.currentTarget.value))) {
			setYear(parseInt(e.currentTarget.value));
		}
	}, []);

	const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	const imperials = getJPImperials(year);
	const imperialStrings = formatImperial(imperials);
	const holidays = getJPHolidays(year);

	const months: Month[] = [];
	const tDate = new Date(year + "-01-01");
	[...Array(12)].forEach((_, i) => months.push({ m: i + 1, d: 0, wd: 0, hd: 0 }));
	while (tDate.getUTCFullYear() === year) {
		const month = months.find(e => e.m === tDate.getUTCMonth() + 1) as Month;
		month.d++;
		if (tDate.getUTCDay() === 0 || tDate.getUTCDay() === 6
			|| holidays.find(e => e.date.getTime() === tDate.getTime())) {
			month.hd++;
		} else {
			month.wd++;
		}
		tDate.setUTCDate(tDate.getUTCDate() + 1);
	}

	return (
		<BaseLayout scope="table-year" isCentering={true}>
			<h1>年情報</h1>
			<div class="flex-pc">
				<p style={{ flex: "none" }}>
					<label>年:
						<input type="number" inputmode="numeric"
							value={year} onInput={onInput} />
					</label>
				</p>
				{year < 1873 && <p class="input-warn">グレゴリオ暦導入前</p>}
				{year > 2299 && <p class="input-warn">春分・秋分は不正確</p>}
			</div>
			<div class="flex-pc">
				<div>
					<h2>年情報</h2>
					<dl>
						<dt>西暦</dt>
						<dd>{year}年</dd>
						<dt>和暦</dt>
						<dd>{imperialStrings.map((e, i) => (
							<>{i !== 0 && <br />}{e}</>
						))}</dd>
						<dt>年間日数</dt>
						<dd>{isLeap ? 366 + "日 (うるう年)" : 365 + "日"}</dd>
						<dt>平日日数</dt>
						<dd>{months.reduce((a, c) => a + c.wd, 0)}日</dd>
						<dt>土休日日数</dt>
						<dd>{months.reduce((a, c) => a + c.hd, 0)}日</dd>
					</dl>
				</div>
				<div>
					<h2>月情報</h2>
					<table>
						<thead>
							<tr>
								<th>月</th><th>日数</th><th>平日</th><th>土休日</th>
							</tr>
						</thead>
						<tbody>
							{months.map(item => (
								<tr>
									<td class="right">{item.m}月</td>
									<td class="right">{item.d}</td>
									<td class="right">{item.wd}</td>
									<td class="right">{item.hd}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div>
					<h2>祝日</h2>
					<table>
						<col style={{ width: "120px" }} />
						<thead><tr><th>月日</th><th>祝日</th></tr></thead>
						<tbody>
							{holidays.map(item => (
								<tr>
									<td>
										{DateEx.format(item.date, "MM/dd")}
										({DateEx.DAYS_JP[item.date.getUTCDay()]})
									</td>
									<td>{item.name}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<h2>ご注意</h2>
			<ul>
				<li>未来の情報は法律の改正や計算式の補正等によって変化する可能性があります</li>
			</ul>
		</BaseLayout>
	);
};

type YEAR_JP = { name: string, year: number, end?: Date, begin?: Date };
const getJPImperials = (yNum: number) => {
	const y1 = new Date(yNum + "-01-01");
	const y2 = new Date(y1.getTime());
	y2.setUTCFullYear(y2.getUTCFullYear() + 1);

	const imperialArr: YEAR_JP[] = [];
	let flg = false;
	for (const item of IMPERIAL_JP.toReversed()) {
		const bTime = item.begin.getTime();
		const lastData = imperialArr[imperialArr.length - 1];
		const data: YEAR_JP = {
			name: item.name,
			year: yNum - new Date(bTime + 32400000).getUTCFullYear() + 1
		};

		if (y1.getTime() <= bTime && bTime < y2.getTime()) {
			data.begin = item.begin;
			if (imperialArr.length && lastData.begin) {
				data.end = new Date(lastData.begin.getTime() - 1);
			}
			imperialArr.push(data);
			flg = true;
		} else if (flg) {
			if (lastData.begin) data.end = new Date(lastData.begin.getTime() - 1);
			imperialArr.push(data);
			flg = false;
			break;
		} else if (bTime <= y1.getTime()) {
			imperialArr.push(data);
			break;
		}
	};

	return imperialArr.toReversed();
};

const formatImperial = (yDatas: YEAR_JP[]) => {
	return yDatas.map(e => {
		let s = e.name + (e.year === 1 ? "元" : e.year) + "年";
		if (e.begin || e.end) {
			s += "(";
			if (e.begin) s += DateEx.format(e.begin, "MM/dd", -540);
			s += "～";
			if (e.end) s += DateEx.format(e.end, "MM/dd", -540);
			s += ")";
		}
		return s;
	});
};
