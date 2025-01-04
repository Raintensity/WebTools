import { PreactDOMAttributes } from "preact";
import { Dispatch, StateUpdater, useCallback, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";

export const meta: AppModuleMeta = {
	hasCSS: true,
	title: "JR東日本 新幹線運賃比較表",
	description: "JR東日本の新幹線の任意の駅を起点とした乗車券・特急券・JREポイント利用の比較計算"
};

export const App = () => (
	<BaseLayout scope="transport-jreast-shinkansen" isCentering={true}>
		<h1>JR東日本 新幹線運賃比較表</h1>
		<p>2025/01/01 現在</p>
		<div><Calculator /></div>

		<h2>ご注意</h2>
		<ul>
			<li>営業キロベースで独自に計算しているため、<em><strong>内容の正確性については保証しません</strong></em>。実際のご利用の際には、必ず信憑性のあるデータを合わせてご確認ください。</li>
			<li>乗車券料金について、東京-大宮間の東京山手線内・電車特定区間制度は適用していません。この区間のみの乗車券は表記よりも少し安くなります。</li>
			<li>Altキー押下中は始点駅の選択が切り替わりません。</li>
		</ul>

		<h2>データ出典</h2>
		<ul>
			<li>運賃計算方法</li>
			<ul>
				<li><a href="https://www.jreast.co.jp/ryokaku/02_hen/03_syo/07_setsu/index.html" target="_blank" rel="noopener noreferrer">JR東日本：旅客営業規則＞第2編　旅客営業 -第3章　旅客運賃・料金 -第7節　急行料金</a></li>
			</ul>
			<li>運賃データ(在来線特急)</li>
			<ul>
				<li><a href="https://www.jreast.co.jp/ryokaku/02_hen/03_syo/07_setsu/02.html" target="_blank" rel="noopener noreferrer">JR東日本：旅客営業規則＞第2編　旅客営業 -第3章　旅客運賃・料金 -第7節　急行料金</a></li>
			</ul>
			<li>運賃データ(新幹線)</li>
			<ul>
				<li><a href="https://www.jreast.co.jp/ryokaku/beppyou/pdf/beppyou02.pdf" target="_blank" rel="noopener noreferrer">別表第2号</a></li>
			</ul>
			<li>JREポイント交換表</li>
			<ul>
				<li><a href="https://www.eki-net.com/top/point/guide/tokuten_section.html" target="_blank" rel="noopener noreferrer">新幹線eチケット（JRE POINT特典）・在来線チケットレス特急券（JRE POINT特典）／新幹線eチケット（JRE POINTアップグレード）交換ポイント早見表｜JRE POINTサービス：えきねっと（JR東日本）</a></li>
			</ul>
			<li>営業キロデータ</li>
			<ul>
				<li><a href="https://ja.wikipedia.org/wiki/東北新幹線" target="_blank" rel="noopener noreferrer">東北新幹線 - Wikipedia</a></li>
				<li><a href="https://ja.wikipedia.org/wiki/上越新幹線" target="_blank" rel="noopener noreferrer">上越新幹線 - Wikipedia</a></li>
				<li><a href="https://ja.wikipedia.org/wiki/北陸新幹線" target="_blank" rel="noopener noreferrer">北陸新幹線 - Wikipedia</a></li>
				<li><a href="https://ja.wikipedia.org/wiki/山形新幹線" target="_blank" rel="noopener noreferrer">山形新幹線 - Wikipedia</a></li>
				<li><a href="https://ja.wikipedia.org/wiki/秋田新幹線" target="_blank" rel="noopener noreferrer">秋田新幹線 - Wikipedia</a></li>
			</ul>
		</ul>
	</BaseLayout>
);

const Calculator = () => {
	const [currentLine, setCurrentLine] = useState(0);
	const [currentStation, setCurrentStation] = useState(440101);

	const changeLine = useCallback((e: InputEvent) => {
		if (!(e.target instanceof HTMLInputElement)) return;
		setCurrentLine(parseInt(e.target.value));
		if (!lines[parseInt(e.target.value)].stations.includes(currentStation)) {
			setCurrentStation(440101);
		}
	}, [currentStation]);

	return (<>
		<p>
			<strong>路線を選択</strong>:&nbsp;
			{lines.map((item, i) => (
				<label>
					<input type="radio" name="line-select" value={i.toString()} onInput={changeLine} checked={i === currentLine} />{item.name}
				</label>
			))}
		</p>
		<table>
			<colgroup>
				<col style={{ width: "150px" }} />
				<col style={{ width: "110px" }} />
				<col style={{ width: "110px" }} />
				<col style={{ width: "110px" }} />
				<col style={{ width: "110px" }} />
				<col style={{ width: "110px" }} />
				<col style={{ width: "110px" }} />
			</colgroup>
			<thead>
				{["駅名", "営業キロ", ...fare.map(e => e.name)].map(item => <th>{item}</th>)}
			</thead>
			<tbody><TableBody line={currentLine} station={currentStation} setStationHandler={setCurrentStation} /></tbody>
		</table>
	</>);
};

interface TableBodyProps extends PreactDOMAttributes {
	line: number
	station: number
	setStationHandler: Dispatch<StateUpdater<number>>
}
const TableBody = (props: TableBodyProps) => {
	const distances = calcDistanceList(props.station);
	const changeStation = (e: MouseEvent) => {
		if (!(e.currentTarget instanceof HTMLTableRowElement)) return;
		if (!e.currentTarget.dataset.station) return;
		if (e.altKey) return;
		props.setStationHandler(parseInt(e.currentTarget.dataset.station));
	};

	return (
		lines[props.line].stations.map(station => {
			const distance = distances.find(e => e.code === station);
			return (
				<tr data-station={station} class={props.station === station ? "active" : ""} onClick={changeStation}>
					<th>{stations.find(e => e.code === station)?.name ?? ""}</th>
					<td class="right">{distance?.d.toFixed(1) ?? "-"}</td>
					{fare.map(f => {
						const calced = f.calc(props.station, station, distance?.d ?? 0, distance?.cd, distance?.hd ?? 0);
						return (
							<td class={calced === null ? "center" : "right"}>
								{calced ?? "-"}
							</td>
						);
					})}
				</tr>
			);
		})
	);
};

interface Line {
	name: string
	stations: number[]
}
const lines: Line[] = [
	{ name: "東北新幹線", stations: [440101, 441003, 441018, 411008, 411012, 411021, 411027, 231007, 231017, 231083, 231035, 231304, 231084, 211005, 211081, 211014, 211082, 211024, 211031, 211039, 211046, 211085, 220895] },
	{ name: "上越新幹線", stations: [440101, 441003, 441018, 411407, 411430, 411416, 411231, 301209, 301215, 301131, 301185, 301150] },
	{ name: "北陸新幹線", stations: [440101, 441003, 441018, 411407, 411430, 411416, 410201, 510201, 510202, 510203, 511114, 511606, 300201] },
	{ name: "山形新幹線", stations: [440101, 441003, 441018, 411008, 411012, 411021, 411027, 231007, 231017, 220801, 220803, 220804, 220807, 220810, 220816, 220899, 220821, 220823, 220828] },
	{ name: "秋田新幹線", stations: [440101, 441003, 441018, 411008, 411012, 411021, 411027, 231007, 231017, 231083, 231035, 231304, 231084, 211005, 211081, 211014, 211082, 211024, 210205, 220201, 220206, 270847, 270855] }
];

interface Station {
	code: number
	name: string
	/** はやぶさ停車駅 */
	h?: boolean
}
const stations: Station[] = [
	{ code: 440101, name: "東京", h: true },
	{ code: 441003, name: "上野", h: true },
	{ code: 441018, name: "大宮", h: true },
	{ code: 411008, name: "小山" },
	{ code: 411012, name: "宇都宮" },
	{ code: 411021, name: "那須塩原" },
	{ code: 411027, name: "新白河" },
	{ code: 231007, name: "郡山" },
	{ code: 231017, name: "福島" },
	{ code: 231083, name: "白石蔵王" },
	{ code: 231035, name: "仙台", h: true },
	{ code: 231304, name: "古川", h: true },
	{ code: 231084, name: "くりこま高原", h: true },
	{ code: 211005, name: "一ノ関", h: true },
	{ code: 211081, name: "水沢江刺", h: true },
	{ code: 211014, name: "北上", h: true },
	{ code: 211082, name: "新花巻", h: true },
	{ code: 211024, name: "盛岡", h: true },
	{ code: 211031, name: "いわて沼宮内", h: true },
	{ code: 211039, name: "二戸", h: true },
	{ code: 211046, name: "八戸", h: true },
	{ code: 211085, name: "七戸十和田", h: true },
	{ code: 220895, name: "新青森", h: true },
	{ code: 411407, name: "熊谷" },
	{ code: 411430, name: "本庄早稲田" },
	{ code: 411416, name: "高崎" },
	{ code: 411231, name: "上毛高原" },
	{ code: 301209, name: "越後湯沢" },
	{ code: 301215, name: "浦佐" },
	{ code: 301131, name: "長岡" },
	{ code: 301185, name: "燕三条" },
	{ code: 301150, name: "新潟" },
	{ code: 410201, name: "安中榛名" },
	{ code: 510201, name: "軽井沢" },
	{ code: 510202, name: "佐久平" },
	{ code: 510203, name: "上田" },
	{ code: 511114, name: "長野" },
	{ code: 511606, name: "飯山" },
	{ code: 300201, name: "上越妙高" },
	{ code: 220801, name: "米沢" },
	{ code: 220803, name: "高畠" },
	{ code: 220804, name: "赤湯" },
	{ code: 220807, name: "かみのやま温泉" },
	{ code: 220810, name: "山形" },
	{ code: 220816, name: "天童" },
	{ code: 220899, name: "さくらんぼ東根" },
	{ code: 220821, name: "村山" },
	{ code: 220823, name: "大石田" },
	{ code: 220828, name: "新庄" },
	{ code: 210205, name: "雫石", h: true },
	{ code: 220201, name: "田沢湖", h: true },
	{ code: 220206, name: "角館", h: true },
	{ code: 270847, name: "大曲", h: true },
	{ code: 270855, name: "秋田", h: true }
];

interface Connector {
	stations: number[]
	d: number
	/** はやぶさ加算運賃区間 */
	h?: boolean
	/** 在来線区間 */
	c?: boolean
}
const connectors: Connector[] = [
	{ stations: [440101, 441003], d: 3.6 },
	{ stations: [441003, 441018], d: 26.7 },
	{ stations: [441018, 411008], d: 50.3 },
	{ stations: [411008, 411012], d: 28.9 },
	{ stations: [411012, 411021], d: 48.3, h: true },
	{ stations: [411021, 411027], d: 27.6, h: true },
	{ stations: [411027, 231007], d: 41.3, h: true },
	{ stations: [231007, 231017], d: 46.1, h: true },
	{ stations: [231017, 231083], d: 34, h: true },
	{ stations: [231083, 231035], d: 45, h: true },
	{ stations: [231035, 231304], d: 43.2, h: true },
	{ stations: [231304, 231084], d: 21.2, h: true },
	{ stations: [231084, 211005], d: 28.9, h: true },
	{ stations: [211005, 211081], d: 25, h: true },
	{ stations: [211081, 211014], d: 17.4, h: true },
	{ stations: [211014, 211082], d: 12.5, h: true },
	{ stations: [211082, 211024], d: 35.3, h: true },
	{ stations: [211024, 211031], d: 31.1 },
	{ stations: [211031, 211039], d: 34.6 },
	{ stations: [211039, 211046], d: 30.9 },
	{ stations: [211046, 211085], d: 36.1 },
	{ stations: [211085, 220895], d: 45.7 },
	{ stations: [441018, 411407], d: 34.4 },
	{ stations: [411407, 411430], d: 21.3 },
	{ stations: [411430, 411416], d: 19 },
	{ stations: [411416, 411231], d: 46.6 },
	{ stations: [411231, 301209], d: 47.6 },
	{ stations: [301209, 301215], d: 29.7 },
	{ stations: [301215, 301131], d: 41.7 },
	{ stations: [301131, 301185], d: 23.2 },
	{ stations: [301185, 301150], d: 40.1 },
	{ stations: [411416, 410201], d: 18.5 },
	{ stations: [410201, 510201], d: 23.3 },
	{ stations: [510201, 510202], d: 17.6 },
	{ stations: [510202, 510203], d: 24.8 },
	{ stations: [510203, 511114], d: 33.2 },
	{ stations: [511114, 511606], d: 29.9 },
	{ stations: [511606, 300201], d: 29.6 },
	{ stations: [231017, 220801], d: 40.1, c: true },
	{ stations: [220801, 220803], d: 9.8, c: true },
	{ stations: [220803, 220804], d: 6.2, c: true },
	{ stations: [220804, 220807], d: 18.9, c: true },
	{ stations: [220807, 220810], d: 12.1, c: true },
	{ stations: [220810, 220816], d: 13.3, c: true },
	{ stations: [220816, 220899], d: 7.7, c: true },
	{ stations: [220899, 220821], d: 5.4, c: true },
	{ stations: [220821, 220823], d: 13.4, c: true },
	{ stations: [220823, 220828], d: 21.7, c: true },
	{ stations: [211024, 210205], d: 16, c: true },
	{ stations: [210205, 220201], d: 24.1, c: true },
	{ stations: [220201, 220206], d: 18.7, c: true },
	{ stations: [220206, 270847], d: 16.8, c: true },
	{ stations: [270847, 270855], d: 51.7, c: true }
];

interface Connection {
	code: number
	d: number
	/** はやぶさ加算運賃区間 */
	h?: boolean
	/** 在来線区間 */
	c?: boolean
}
const connections: { [key: number]: Connection[] } = {};
connectors.forEach(e => {
	if (!connections[e.stations[0]]) connections[e.stations[0]] = [];
	if (!connections[e.stations[1]]) connections[e.stations[1]] = [];
	if (!connections[e.stations[0]].find(v => v.code === e.stations[1])) connections[e.stations[0]].push({ code: e.stations[1], d: e.d, c: e.c, h: e.h });
	if (!connections[e.stations[1]].find(v => v.code === e.stations[0])) connections[e.stations[1]].push({ code: e.stations[0], d: e.d, c: e.c, h: e.h });
});

const fareTable = [
	{
		code: 1, // 乗車券
		list: [
			{ d: 3, fare: 150 },
			{ d: 6, fare: 190 },
			{ d: 10, fare: 200 },
			{ d: 15, fare: 240 },
			{ d: 20, fare: 330 },
			{ d: 25, fare: 420 },
			{ d: 30, fare: 510 },
			{ d: 35, fare: 590 },
			{ d: 40, fare: 680 },
			{ d: 45, fare: 770 },
			{ d: 50, fare: 860 },
			{ d: 60, fare: 990 },
			{ d: 70, fare: 1170 },
			{ d: 80, fare: 1340 },
			{ d: 90, fare: 1520 },
			{ d: 100, fare: 1690 },
			{ d: 120, fare: 1980 },
			{ d: 140, fare: 2310 },
			{ d: 160, fare: 2640 },
			{ d: 180, fare: 3080 },
			{ d: 200, fare: 3410 },
			{ d: 220, fare: 3740 },
			{ d: 240, fare: 4070 },
			{ d: 260, fare: 4510 },
			{ d: 280, fare: 4840 },
			{ d: 300, fare: 5170 },
			{ d: 320, fare: 5500 },
			{ d: 340, fare: 5720 },
			{ d: 360, fare: 6050 },
			{ d: 380, fare: 6380 },
			{ d: 400, fare: 6600 },
			{ d: 420, fare: 6930 },
			{ d: 440, fare: 7150 },
			{ d: 460, fare: 7480 },
			{ d: 480, fare: 7700 },
			{ d: 500, fare: 8030 },
			{ d: 520, fare: 8360 },
			{ d: 540, fare: 8580 },
			{ d: 560, fare: 8910 },
			{ d: 580, fare: 9130 },
			{ d: 600, fare: 9460 },
			{ d: 640, fare: 9790 },
			{ d: 680, fare: 10010 },
			{ d: 720, fare: 10340 },
			{ d: 760, fare: 10670 },
			{ d: 800, fare: 11000 },
			{ d: 840, fare: 11330 },
			{ d: 880, fare: 11550 },
			{ d: 920, fare: 11880 },
			{ d: 960, fare: 12210 },
			{ d: 1000, fare: 12540 }
		]
	},
	{
		code: 2, // 指定席特急券(新幹線)
		list: [
			{ d: 0, fare: 0 },
			{ d: 100, fare: 2400 },
			{ d: 150, fare: 2830 },
			{ d: 200, fare: 3170 },
			{ d: 300, fare: 4060 },
			{ d: 400, fare: 4830 },
			{ d: 500, fare: 5370 },
			{ d: 600, fare: 5700 },
			{ d: 700, fare: 6070 },
			{ d: 800, fare: 6600 }
		]
	},
	{
		code: 3, // 指定席特急券(ミニ新幹線)
		list: [
			{ d: 50, fare: 1290 },
			{ d: 100, fare: 1660 },
			{ d: 150, fare: 2110 }
		]
	},
	{
		code: 4, // 特定特急券(新幹線)
		list: [
			{ d: 50, fare: 880 },
			{ d: 100, fare: 1000 }
		]
	},
	{
		code: 5, // JREポイント
		list: [
			{ d: 100, fare: 2160 },
			{ d: 200, fare: 4620 },
			{ d: 400, fare: 7940 },
			{ d: 800, fare: 12110 }
		]
	},
	{
		code: 6, // はやぶさ加算運賃
		list: [
			{ d: 0, fare: 0 },
			{ d: 100, fare: 100 },
			{ d: 200, fare: 210 },
			{ d: 300, fare: 320 },
			{ d: 400, fare: 420 },
			{ d: 500, fare: 520 }
		]
	}
];

const toFixed = (n: number, d: number) => Math.round(10 ** d * n) / 10 ** d;

interface Fare {
	name: string
	calc: (a: number, b: number, d: number, cd?: number, hd?: number) => number | null
}
const fare: Fare[] = [
	{
		name: "乗車券",
		calc(a, b, d) {
			if (a === b) return null;
			const table = fareTable.find(e => e.code === 1);
			return table?.list.find(e => d <= e.d)?.fare ?? null;
		}
	},
	{
		name: "自由席特急券",
		calc(a, b, d, cd = 0) {
			if (a === b) return null;
			const table = fareTable.find(e => e.code === 4);
			if (!table) return null;
			const isAdjacent = connections[a].find(e => e.code === b);
			if (isAdjacent && cd === 0) {
				return table.list.find(e => isAdjacent.d <= e.d)?.fare ?? null;
			}
			if ((a === 231304 || b === 231304) && (a === 211005 || b === 211005)) { // 古川-一ノ関
				return table.list.find(e => 100 <= e.d)?.fare ?? null;
			}
			if ((a === 211005 || b === 211005) && (a === 211014 || b === 211014)) { // 一ノ関-北上
				return table.list.find(e => 50 <= e.d)?.fare ?? null;
			}
			if ((a === 211014 || b === 211014) && (a === 211024 || b === 211024)) { // 北上-盛岡
				return table.list.find(e => 50 <= e.d)?.fare ?? null;
			}
			if ((a === 411407 || b === 411407) && (a === 411416 || b === 411416)) { // 熊谷-高崎
				return table.list.find(e => 50 <= e.d)?.fare ?? null;
			}
			if ((a === 440101 || b === 440101) && (a === 441018 || b === 441018)) { // 東京-大宮
				return (table.list.find(e => 50 <= e.d)?.fare ?? 0) + 210;
			}
			return (fare.find(e => e.name === "指定席特急券")?.calc(a, b, d, cd) ?? 0) - 530;
		}
	},
	{
		name: "指定席特急券",
		calc(a, b, d, cd = 0) {
			if (a === b) return null;
			const table = fareTable.find(e => e.code === 2);
			const table2 = fareTable.find(e => e.code === 3);
			if (!table || !table2) return null;
			if ((a === 440101 || b === 440101) && (a !== 441003 && b !== 441003)) { // 東京-上野以遠
				return (table.list.find(e => toFixed(d - 3.6 - (cd ?? 0), 1) <= e.d)?.fare ?? 0) + 210 + (cd ? (table2.list.find(e => toFixed(cd, 1) <= e.d)?.fare ?? 0) - 530 : 0);
			}
			if ((a === 441018 || b === 441018) && (toFixed(d - cd, 1) === 505)) { // 大宮-盛岡・秋田新幹線
				return (table.list.find(e => 500 <= e.d)?.fare ?? 0) + (cd ? (table2.list.find(e => toFixed(cd, 1) <= e.d)?.fare ?? 0) - 530 : 0);
			}
			if ((a === 231007 || b === 231007) && (toFixed(d - cd, 1) === 46.1)) { // 郡山-福島・山形新幹線
				return 1410 + (cd ? (table2.list.find(e => toFixed(cd, 1) <= e.d)?.fare ?? 0) - 530 : 0);
			}
			return (table.list.find(e => d - (cd ?? 0) <= e.d)?.fare ?? 0) + (cd ? (table2.list.find(e => toFixed(cd, 1) <= e.d)?.fare ?? 0) - (d - cd > 0 ? 530 : 0) : 0);
		}
	},
	{
		name: "はやぶさ加算",
		calc(a, b, _d, _cd, hd = 0) {
			if (a === b) return null;
			if (stations.find(e => e.code === a)?.h !== true) return null;
			if (stations.find(e => e.code === b)?.h !== true) return null;
			const table = fareTable.find(e => e.code === 6);
			return table?.list.find(e => hd <= e.d)?.fare ?? null;
		}
	},
	{
		name: "JREポイント",
		calc(a, b, d) {
			if (a === b) return null;
			const table = fareTable.find(e => e.code === 5);
			return table?.list.find(e => d <= e.d)?.fare ?? null;
		}
	}
];

const calcDistanceList = (a: number) => {
	const result: { code: number, d: number, cd: number, hd: number }[] = [];
	const stack: { code: number, d: number, cd: number, hd: number }[] = [];
	stack.push(...connections[a].map(e => ({ code: e.code, d: e.d, cd: e.c ? e.d : 0, hd: e.h ? e.d : 0 })));
	while (stack.length) {
		const v = stack.shift();
		if (!v || v.code === a) continue;
		const f = result.find(e => e.code === v.code);
		if (f) {
			if (v.d < f.d) {
				f.d = v.d;
				stack.push(...connections[v.code].map(e => ({ code: e.code, d: toFixed(e.d + v.d, 1), cd: toFixed(v.cd + (e.c ? e.d : 0), 1), hd: toFixed(v.hd + (e.h ? e.d : 0), 1) })));
			}
		} else {
			result.push(v);
			stack.push(...connections[v.code].map(e => ({ code: e.code, d: toFixed(e.d + v.d, 1), cd: toFixed(v.cd + (e.c ? e.d : 0), 1), hd: toFixed(v.hd + (e.h ? e.d : 0), 1) })));
		}
	}
	return result;
};
