import { useCallback, useRef, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";
import { DateEx, IMPERIAL_JP } from "lib/util";

export const meta: AppModuleMeta = {
	hasCSS: true,
	title: "日時フォーマット変換",
	description: "日時を各種フォーマットに変換"
};

const TIMEZONE_LIST = [
	-12, -11, -10, -9.5, -9, -8, -7, -6, -5, -4,
	-3.5, -3, -2, -1, 0, 1, 2, 3, 3.5, 4,
	4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 8.75, 9,
	9.5, 10, 10.5, 11, 12, 12.75, 13, 14
];
const SERIAL_BEGIN = new Date("1900-01-01").getTime();

export const App = () => {
	const [datetime, setDatetime] = useState(new DateEx);

	const jpienRef = useRef<HTMLSelectElement>(null);
	const jpyearRef = useRef<HTMLInputElement>(null);

	const onChange = useCallback((e: Event) => {
		if (!e.currentTarget || !jpienRef.current || !jpyearRef.current) {
			return;
		}
		if (!(e.currentTarget instanceof HTMLInputElement)
			&& !(e.currentTarget instanceof HTMLSelectElement)) {
			return;
		}

		const val = e.currentTarget.value;
		if (e.currentTarget.name === "iso") {
			if (Number.isNaN(Date.parse(val))) return;
			setDatetime(fixedDateEx(Date.parse(val)));
		} else if (e.currentTarget.name === "datetime") {
			if (Number.isNaN(Date.parse(val))) return;
			setDatetime(p => {
				const d = new DateEx(val + "Z");
				d.setOffset(p.getOffset());
				d.removeOffset();
				d.setUTCSeconds(p.getUTCSeconds());
				d.setUTCMilliseconds(p.getUTCMilliseconds());
				return d;
			});
		} else if (e.currentTarget.name === "date") {
			if (Number.isNaN(Date.parse(val))) return;
			setDatetime(clonedDateEx(d => {
				const n = new DateEx(val);
				n.removeOffset();
				d.setOffsetFullYear(n.getOffsetFullYear());
				d.setOffsetMonth(n.getOffsetMonth());
				d.setOffsetDate(n.getOffsetDate());
			}));
		} else if (e.currentTarget.name === "time") {
			const t = val.match(/^(0?[0-9]|1[0-9]|2[0-3]):([0-5]?[0-9])(?::([0-5]?[0-9]))?$/);
			if (!t) return;
			setDatetime(clonedDateEx(d => {
				d.setOffsetHours(parseInt(t[1]));
				d.setOffsetMinutes(parseInt(t[2]));
				if (typeof t[3] !== "undefined") {
					d.setUTCSeconds(parseInt(t[3]));
				}
			}));
		} else if (e.currentTarget.name === "jpien") {
			if (val === "" || Number.isNaN(parseInt(jpyearRef.current.value))) return;
			const jpyear = jpyearRef.current;
			const era = IMPERIAL_JP.find(e => e.name === val);
			if (!era) return;

			setDatetime(clonedDateEx(d => {
				d.setFullYear(era.begin.getFullYear() + parseInt(jpyear.value) - 1);
			}));
		} else if (e.currentTarget.name === "jpyear") {
			if (jpienRef.current.value === "" || Number.isNaN(parseInt(val))) return;
			const jpien = jpienRef.current.value;
			const era = IMPERIAL_JP.find(e => e.name === jpien);
			if (!era) return;

			setDatetime(clonedDateEx(d => {
				d.setFullYear(era.begin.getFullYear() + parseInt(val) - 1);
			}));
		} else if (e.currentTarget.name === "unixtime") {
			if (Number.isNaN(parseFloat(val))) return;
			setDatetime(fixedDateEx(parseFloat(val) * 1000));
		} else if (e.currentTarget.name === "serial") {
			if (Number.isNaN(parseFloat(val))) return;
			setDatetime(clonedDateEx(d => {
				d.setTime((parseFloat(val) - 1) * 24 * 60 * 60 * 1000 + SERIAL_BEGIN);
				d.removeOffset();
			}));
		} else if (e.currentTarget.name === "jd") {
			if (Number.isNaN(parseFloat(val))) return;
			setDatetime(fixedDateEx((parseFloat(val) - 2440587.5) * 24 * 60 * 60 * 1000));
		} else if (e.currentTarget.name === "mjd") {
			if (Number.isNaN(parseFloat(val))) return;
			setDatetime(fixedDateEx((parseFloat(val) - 40587) * 24 * 60 * 60 * 1000));
		}
	}, [jpienRef, jpyearRef]);

	const setCurrentDate = useCallback(() => {
		setDatetime(clonedDateEx(d => d.setTime(Date.now())));
	}, []);

	const changeTimezone = useCallback((e: InputEvent) => {
		if (!e.currentTarget || !(e.currentTarget instanceof HTMLSelectElement)) {
			return;
		}
		if (!e.currentTarget.value) {
			return;
		}

		const offset = e.currentTarget.value;
		setDatetime(clonedDateEx(d => d.setOffset(-parseFloat(offset) * 60)));
	}, []);

	const clearTime = useCallback(() => {
		setDatetime(clonedDateEx(d => {
			d.setOffsetHours(0);
			d.setOffsetMinutes(0);
			d.setUTCSeconds(0);
			d.setUTCMilliseconds(0);
		}));
	}, []);

	const clearMilliseconds = useCallback(() => {
		setDatetime(clonedDateEx(d => d.setMilliseconds(0)));
	}, []);

	const timezone = -datetime.getOffset() / 60;
	const iso = datetime.toISOString();
	const date = datetime.formatWithOffset("yyyy-MM-dd");
	const time = datetime.formatWithOffset("hh:mm");
	const jpienObj = IMPERIAL_JP.toReversed().find(a => a.begin <= datetime);
	const jpien = jpienObj?.name ?? "";
	const jpyear = jpienObj ?
		datetime.getFullYear() - jpienObj.begin.getFullYear() + 1 : null;
	const unixtime = datetime.getTime() / 1000;
	const serial = (datetime.getTime() - SERIAL_BEGIN) / 1000 / 60 / 60 / 24
		+ timezone / 24 + 1;
	const jd = datetime.getTime() / 1000 / 60 / 60 / 24 + 2440587.5;
	const mjd = datetime.getTime() / 1000 / 60 / 60 / 24 + 40587;

	return (
		<BaseLayout scope="convert-datetime" isCentering={true}>
			<h1>日時フォーマット変換</h1>
			<div class="flex-pc">
				<div>
					<h3>タイムゾーン</h3>
					<p>
						<select name="offset" onInput={changeTimezone}>
							{TIMEZONE_LIST.map(e => (
								<option value={e} selected={timezone === e}>
									{e}
								</option>
							))}
						</select>
					</p>
					<h3>一括操作</h3>
					<p>
						<input type="button"
							value="現在日時" onClick={setCurrentDate} />
						<input type="button"
							value="時刻クリア" onClick={clearTime} />
						<input type="button"
							value="ミリ秒クリア" onClick={clearMilliseconds} />
					</p>
					<h3>ISO8601 / RFC3339</h3>
					<p>
						<input
							type="text" name="iso"
							value={iso} onBlur={onChange} />
					</p>
					<h3>日時<span>タイムゾーン基準</span></h3>
					<p>
						<input type="datetime-local" name="datetime"
							value={date + "T" + time} onBlur={onChange} />
					</p>
					<h3>日付・時間<span>タイムゾーン基準</span></h3>
					<p>
						<input
							type="date" name="date"
							value={date} onBlur={onChange} />
						<input
							type="time" name="time"
							value={time} onBlur={onChange} />
					</p>
					<h3>和暦<span>タイムゾーン基準</span></h3>
					<p>
						<select name="jpien" onInput={onChange} ref={jpienRef}>
							<option value=""></option>
							{IMPERIAL_JP.map(e => (
								<option value={e.name} selected={e.name === jpien}>
									{e.name}
								</option>
							))}
						</select>
						<input
							type="number" name="jpyear" inputmode="numeric"
							value={jpyear ?? ""} onBlur={onChange} ref={jpyearRef} />
					</p>
				</div>
				<div>
					<h3>UNIX時間</h3>
					<p>
						<input
							type="number" name="unixtime" inputmode="numeric"
							value={unixtime} onBlur={onChange} />
					</p>
					<h3>シリアル値(Excel系)<span>タイムゾーン基準</span></h3>
					<p>
						<input
							type="number" name="serial" inputmode="numeric"
							value={serial} onBlur={onChange} />
					</p>
					<h3>ユリウス通日</h3>
					<p>
						<input
							type="number" name="jd" inputmode="numeric"
							value={jd} onBlur={onChange} />
					</p>
					<h3>修正ユリウス日</h3>
					<p>
						<input
							type="number" name="mjd" inputmode="numeric"
							value={mjd} onBlur={onChange} />
					</p>
				</div>
			</div>

			<h2>使い方</h2>
			<ul>
				<li>各入力欄の文字を書き換えると、他の入力欄の値が一括で変換されます。</li>
			</ul>
		</BaseLayout>
	);
};

const fixedDateEx = (value: number) => {
	return (p: DateEx) => {
		const dateEx = new DateEx();
		dateEx.setTime(value);
		dateEx.setOffset(p.getOffset());
		return dateEx;
	};
};

const clonedDateEx = (fn: (dateEx: DateEx) => any) => {
	return (p: DateEx) => {
		const dateEx = p.clone();
		const result = fn(dateEx);
		if (result instanceof DateEx) return result;
		return dateEx;
	};
};
