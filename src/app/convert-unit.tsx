import Big from "big.js";
import { PreactDOMAttributes } from "preact";
import { useCallback, useRef, useState } from "preact/hooks";
import { BaseLayout } from "components/layout";
import { AppMeta } from "lib/const";

export const meta: AppMeta = {
	hasCSS: true
};

export const App = () => {
	return (
		<BaseLayout scope="convert-unit" isCentering={true}>
			<h1>単位変換</h1>
			<CalclatorInfoPrefix />
			<CalclatorBitrate />
			<CalclatorSIPrefix />
		</BaseLayout>
	);
};

const CalclatorInfoPrefix = () => {
	const typeARef = useRef("MB");
	const typeBRef = useRef("GB");
	const [num, setNum] = useState(BIG_ZERO);

	const onInput = useCallback((e: InputEvent) => {
		if (!e.currentTarget ||
			(!(e.currentTarget instanceof HTMLInputElement)
				&& !(e.currentTarget instanceof HTMLSelectElement))) {
			return;
		}
		const c = e.currentTarget;
		if (e.currentTarget instanceof HTMLInputElement && !isValidBig(c.value)) {
			return;
		}
		const getUnit = (name: string) => getUnitItem(UNITLIST_INFO, name);
		if (c.name === "type_info_a") {
			setNum(b => b.div(getUnit(typeARef.current)).mul(getUnit(c.value)));
			typeARef.current = c.value;
		} else if (c.name === "num_info_a") {
			setNum(new Big(c.value).mul(getUnit(typeARef.current)));
		} else if (c.name === "type_info_b") {
			setNum(b => b.div(getUnit(typeBRef.current)).mul(getUnit(c.value)));
			typeBRef.current = c.value;
		} else if (c.name === "num_info_b") {
			setNum(new Big(c.value).mul(getUnit(typeBRef.current)));
		}
	}, []);

	const typeADiv = getUnitItem(UNITLIST_INFO, typeARef.current);
	const typeBDiv = getUnitItem(UNITLIST_INFO, typeBRef.current);
	return (<>
		<h2>情報量の相互変換</h2>
		<div class="flex-pc">
			<div>
				<h3>A</h3>
				<p>
					<input type="number" name="num_info_a" onInput={onInput}
						value={num.div(typeADiv).toString()} />
					<UnitSelector name="type_info_a" value={typeARef.current}
						options={UNITLIST_INFO} onInput={onInput} />
				</p>
			</div>
			<div>
				<h3>B</h3>
				<p>
					<input type="number" name="num_info_b" onInput={onInput}
						value={num.div(typeBDiv).toString()} />
					<UnitSelector name="type_info_b" value={typeBRef.current}
						options={UNITLIST_INFO} onInput={onInput} />
				</p>
			</div>
		</div>
	</>);
};

const CalclatorBitrate = () => {
	const targetRef = useRef("size");
	const typeVal1Ref = useRef("kb");
	const typeVal2Ref = useRef("s");
	const [typeTarget, setTypeTarget] = useState("MB");
	const [val, setVal] = useState({ val1: BIG_ZERO, val2: BIG_ZERO });

	const onChangeTarget = useCallback((target: string) => {
		if (targetRef.current === target) return;
		if (targetRef.current === "bitrate" && target === "length") {
			setVal(b => ({ ...b, val1: divBig(b.val2, b.val1) }));
			setTypeTarget(b => {
				[typeVal1Ref.current, b] = [b, typeVal1Ref.current];
				return b;
			});
		} else if (targetRef.current === "bitrate" && target === "size") {
			setVal(b => ({ val1: divBig(b.val2, b.val1), val2: b.val1 }));
			setTypeTarget(b => {
				[typeVal1Ref.current, typeVal2Ref.current, b]
					= [b, typeVal1Ref.current, typeVal2Ref.current];
				return b;
			});
		} else if (targetRef.current === "length" && target === "bitrate") {
			setVal(b => ({ ...b, val1: divBig(b.val2, b.val1) }));
			setTypeTarget(b => {
				[typeVal1Ref.current, b] = [b, typeVal1Ref.current];
				return b;
			});
		} else if (targetRef.current === "length" && target === "size") {
			setVal(b => ({ ...b, val2: divBig(b.val2, b.val1) }));
			setTypeTarget(b => {
				[typeVal2Ref.current, b] = [b, typeVal2Ref.current];
				return b;
			});
		} else if (targetRef.current === "size" && target === "bitrate") {
			setVal(b => ({ val1: b.val2, val2: b.val1.mul(b.val2) }));
			setTypeTarget(b => {
				[b, typeVal1Ref.current, typeVal2Ref.current]
					= [typeVal1Ref.current, typeVal2Ref.current, b];
				return b;
			});
		} else if (targetRef.current === "size" && target === "length") {
			setVal(b => ({ ...b, val2: b.val1.mul(b.val2) }));
			setTypeTarget(b => {
				[typeVal2Ref.current, b] = [b, typeVal2Ref.current];
				return b;
			});
		}
		targetRef.current = target;
	}, []);

	const onInput = useCallback((e: InputEvent) => {
		if (!e.currentTarget ||
			(!(e.currentTarget instanceof HTMLInputElement)
				&& !(e.currentTarget instanceof HTMLSelectElement))) {
			return;
		}
		const c = e.currentTarget;
		if (e.currentTarget instanceof HTMLInputElement && !isValidBig(c.value)) {
			return;
		}
		const val1IUnit = getUnitItem(UNITLIST_INFO, typeVal1Ref.current);
		const val1TUnit = getUnitItem(UNITLIST_TIME, typeVal1Ref.current);
		const val2IUnit = getUnitItem(UNITLIST_INFO, typeVal2Ref.current);
		const val2TUnit = getUnitItem(UNITLIST_TIME, typeVal2Ref.current);
		if (c.name === "bitrate") {
			setVal(b => ({ ...b, val1: new Big(c.value).mul(val1IUnit) }));
		} else if (c.name === "length" && targetRef.current === "bitrate") {
			setVal(b => ({ ...b, val1: new Big(c.value).mul(val1TUnit) }));
		} else if (c.name === "length" && targetRef.current === "size") {
			setVal(b => ({ ...b, val2: new Big(c.value).mul(val2TUnit) }));
		} else if (c.name === "size") {
			setVal(b => ({ ...b, val2: new Big(c.value).mul(val2IUnit) }));
		} else if (targetRef.current === c.name.slice(5)) {
			setTypeTarget(c.value);
		} else if (c.name === "type_bitrate") {
			const cUnit = getUnitItem(UNITLIST_INFO, c.value);
			setVal(b => ({ ...b, val1: b.val1.div(val1IUnit).mul(cUnit) }));
			typeVal1Ref.current = c.value;
		} else if (c.name === "type_length" && targetRef.current === "bitrate") {
			const cUnit = getUnitItem(UNITLIST_TIME, c.value);
			setVal(b => ({ ...b, val1: b.val1.div(val1TUnit).mul(cUnit) }));
			typeVal1Ref.current = c.value;
		} else if (c.name === "type_length" && targetRef.current === "size") {
			const cUnit = getUnitItem(UNITLIST_TIME, c.value);
			setVal(b => ({ ...b, val2: b.val2.div(val2TUnit).mul(cUnit) }));
			typeVal2Ref.current = c.value;
		} else if (c.name === "type_size") {
			const cUnit = getUnitItem(UNITLIST_INFO, c.value);
			setVal(b => ({ ...b, val2: b.val2.div(val2IUnit).mul(cUnit) }));
			typeVal2Ref.current = c.value;
		}
	}, []);

	const typeB = targetRef.current === "bitrate" ? typeTarget : typeVal1Ref.current;
	const typeL = targetRef.current === "length" ? typeTarget :
		targetRef.current === "bitrate" ? typeVal1Ref.current : typeVal2Ref.current;
	const typeS = targetRef.current === "size" ? typeTarget : typeVal2Ref.current;
	const typeBDiv = getUnitItem(UNITLIST_INFO, typeB);
	const typeLDiv = getUnitItem(UNITLIST_TIME, typeL);
	const typeSDiv = getUnitItem(UNITLIST_INFO, typeS);
	const bitrate = (targetRef.current === "bitrate" ?
		divBig(val.val2, val.val1) : val.val1);
	const length = (targetRef.current === "length" ? divBig(val.val2, val.val1) :
		targetRef.current === "bitrate" ? val.val1 : val.val2);
	const size = (targetRef.current === "size" ? val.val1.mul(val.val2) : val.val2);
	return (<>
		<h2>ビットレート計算</h2>
		<div class="flex-pc">
			<div>
				<h3>
					ビットレート(毎秒)
					<button disabled={targetRef.current === "bitrate"}
						onClick={() => onChangeTarget("bitrate")}>
						{targetRef.current === "bitrate" ? "変動" : "固定"}
					</button>
				</h3>
				<p>
					<input type="number" name="bitrate" onInput={onInput}
						value={bitrate.div(typeBDiv).toString()} />
					<UnitSelector name="type_bitrate" value={typeB}
						options={UNITLIST_INFO} onInput={onInput} />
				</p>
			</div>
			<div>
				<h3>
					長さ
					<button disabled={targetRef.current === "length"}
						onClick={() => onChangeTarget("length")}>
						{targetRef.current === "length" ? "変動" : "固定"}
					</button>
				</h3>
				<p>
					<input type="number" name="length" onInput={onInput}
						value={length.div(typeLDiv).toString()} />
					<UnitSelector name="type_length" value={typeL}
						options={UNITLIST_TIME} onInput={onInput} />
				</p>
			</div>
			<div>
				<h3>
					容量(総サイズ)
					<button disabled={targetRef.current === "size"}
						onClick={() => onChangeTarget("size")}>
						{targetRef.current === "size" ? "変動" : "固定"}
					</button>
				</h3>
				<p>
					<input type="number" name="size" onInput={onInput}
						value={size.div(typeSDiv).toString()} />
					<UnitSelector name="type_size" value={typeS}
						options={UNITLIST_INFO} onInput={onInput} />
				</p>
			</div>
		</div>
	</>);
};

const CalclatorSIPrefix = () => {
	const typeARef = useRef("");
	const typeBRef = useRef("k");
	const [num, setNum] = useState(BIG_ZERO);

	const onInputSI = useCallback((e: InputEvent) => {
		if (!e.currentTarget ||
			(!(e.currentTarget instanceof HTMLInputElement)
				&& !(e.currentTarget instanceof HTMLSelectElement))) {
			return;
		}
		const c = e.currentTarget;
		if (e.currentTarget instanceof HTMLInputElement && !isValidBig(c.value)) {
			return;
		}
		const getUnit = (name: string) => getUnitItem(UNITLIST_SI, name);
		if (c.name === "type_si_a") {
			setNum(b => b.div(getUnit(typeARef.current)).mul(getUnit(c.value)));
			typeARef.current = c.value;
		} else if (c.name === "num_si_a") {
			setNum(new Big(c.value).mul(getUnit(typeARef.current)));
		} else if (c.name === "type_si_b") {
			setNum(b => b.div(getUnit(typeBRef.current)).mul(getUnit(c.value)));
			typeBRef.current = c.value;
		} else if (c.name === "num_si_b") {
			setNum(new Big(c.value).mul(getUnit(typeBRef.current)));
		}
	}, []);

	const typeADiv = getUnitItem(UNITLIST_SI, typeARef.current);
	const typeBDiv = getUnitItem(UNITLIST_SI, typeBRef.current);
	return (<>
		<h2>SI接頭辞の相互変換</h2>
		<div class="flex-pc">
			<div>
				<h3>A</h3>
				<p>
					<input type="number" name="num_si_a" onInput={onInputSI}
						value={num.div(typeADiv).toString()} />
					<UnitSelector name="type_si_a" value={typeARef.current}
						options={UNITLIST_SI} onInput={onInputSI} />
				</p>
			</div>
			<div>
				<h3>B</h3>
				<p>
					<input type="number" name="num_si_b" onInput={onInputSI}
						value={num.div(typeBDiv).toString()} />
					<UnitSelector name="type_si_b" value={typeBRef.current}
						options={UNITLIST_SI} onInput={onInputSI} />
				</p>
			</div>
		</div>
	</>);
};

interface UnitBase {
	name: string
	symbol: string
};
interface Unit10 extends UnitBase {
	base10: number
}
const PREFIX_SI: Unit10[] = [
	{ name: "エクサ", symbol: "E", base10: 18 },
	{ name: "ペタ", symbol: "P", base10: 15 },
	{ name: "テラ", symbol: "T", base10: 12 },
	{ name: "ギガ", symbol: "G", base10: 9 },
	{ name: "メガ", symbol: "M", base10: 6 },
	{ name: "キロ", symbol: "k", base10: 3 },
	{ name: "ヘクト", symbol: "h", base10: 2 },
	{ name: "デカ", symbol: "da", base10: 1 },
	{ name: "", symbol: "", base10: 0 },
	{ name: "デシ", symbol: "d", base10: -1 },
	{ name: "センチ", symbol: "c", base10: -2 },
	{ name: "ミリ", symbol: "m", base10: -3 },
	{ name: "マイクロ", symbol: "μ", base10: -6 },
	{ name: "ナノ", symbol: "n", base10: -9 },
	{ name: "ピコ", symbol: "p", base10: -12 },
] as const;

interface Unit2 extends UnitBase {
	base2: number
}
const PREFIX_BIN: Unit2[] = [
	{ name: "", symbol: "", base2: 0 },
	{ name: "キビ", symbol: "Ki", base2: 10 },
	{ name: "メビ", symbol: "Mi", base2: 20 },
	{ name: "ギビ", symbol: "Gi", base2: 30 },
	{ name: "テビ", symbol: "Ti", base2: 40 },
	{ name: "ペビ", symbol: "Pi", base2: 50 },
	{ name: "エクスビ", symbol: "Ei", base2: 60 },
] as const;

interface UnitTime extends UnitBase {
	base60: number
}
const PREFIX_TIME: UnitTime[] = [
	{ name: "秒", symbol: "s", base60: 0 },
	{ name: "分", symbol: "m", base60: 1 },
	{ name: "時間", symbol: "h", base60: 2 },
] as const;

interface Unit extends UnitBase {
	unit: Big
}
const UNITLIST_INFO: Unit[] = [
	...PREFIX_SI.filter(e => e.base10 >= 3).map(e => ({
		name: e.name + "バイト", symbol: e.symbol + "B",
		unit: new Big(10).pow(e.base10).mul(new Big(2).pow(3))
	})),
	...PREFIX_SI.filter(e => e.base10 >= 3).map(e => ({
		name: e.name + "ビット", symbol: e.symbol + "b",
		unit: new Big(10).pow(e.base10)
	})),
	...PREFIX_BIN.map(e => ({
		name: e.name + "バイト", symbol: e.symbol + "B",
		unit: new Big(2).pow(e.base2 + 3)
	})),
	{ name: "ビット", symbol: "b", unit: new Big(1) }
].sort((a, b) => a.unit.cmp(b.unit));
const UNITLIST_SI: Unit[] = [...PREFIX_SI.map(e => ({
	name: e.name, symbol: e.symbol, unit: new Big(10).pow(e.base10)
}))];
const UNITLIST_TIME: Unit[] = [...PREFIX_TIME.map(e => ({
	name: e.name, symbol: e.symbol, unit: new Big(60).pow(e.base60)
}))];

interface UnitSelectorProps extends PreactDOMAttributes {
	name: string
	value: string | undefined
	options: Unit[]
	onInput: (e: InputEvent) => void
}
const UnitSelector = (props: UnitSelectorProps) => {
	return (
		<select name={props.name} value={props.value} onInput={props.onInput}>
			{props.options && props.options.map(e => (
				<option value={e.symbol}>
					{(e.symbol || e.name) && e.symbol + ":" + e.name}
				</option>
			))}
		</select>
	);
};

const BIG_ZERO = new Big(0);
const isValidBig = (str: string) => {
	try {
		return !Number.isNaN(new Big(str));
	} catch {
		return false;
	}
};
const getUnitItem = (list: Unit[], name: string) =>
	list.find(e => e.symbol === name)?.unit ?? new Big(1);
const isZero = (big: Big) => big.toString() === "0";
const divBig = (a: Big, b: Big) => isZero(b) ? BIG_ZERO : a.div(b);
