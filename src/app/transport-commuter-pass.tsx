import { BaseLayout } from "components/layout";
import { AppModuleMeta } from "lib/const";
import { PreactDOMAttributes } from "preact";
import { useState } from "preact/hooks";

export const App = () => (
	<BaseLayout scope="transport-commuter-pass" isCentering={true}>
		<h1>普通乗車券と定期券の比較計算</h1>
		<div><Calculator /></div>
		<h2>計算について</h2>
		<ul>
			<li>片道回数については小数切り上げ、往復と1ヶ月あたりの回数は小数第2位を四捨五入</li>
		</ul>
	</BaseLayout>
);

const Calculator = () => {
	const [normalFare, setNormalFare] = useState("0");
	const [mo1Fare, setMo1Fare] = useState("");
	const [mo3Fare, setMo3Fare] = useState("");
	const [mo6Fare, setMo6Fare] = useState("");

	return (
		<dl>
			<dt><label for="normal">乗車券</label></dt>
			<dd>
				<p><input type="number" name="normal" id="normal" value={normalFare} onInput={e => setNormalFare(e.currentTarget.value)} inputmode="numeric" min="0" /></p>
				<output>{checkNormalFare(normalFare)?.error}</output>
			</dd>
			<dt><label for="1month">定期券 1箇月</label></dt>
			<dd>
				<p><input type="number" name="1month" id="1month" value={mo1Fare} onInput={e => setMo1Fare(e.currentTarget.value)} inputmode="numeric" min="0" /></p>
				<Result result={calc(normalFare, mo1Fare, 1)} />
			</dd>
			<dt><label for="3months">定期券 3箇月</label></dt>
			<dd>
				<p><input type="number" name="3months" id="3months" value={mo3Fare} onInput={e => setMo3Fare(e.currentTarget.value)} inputmode="numeric" min="0" /></p>
				<Result result={calc(normalFare, mo3Fare, 3)} />
			</dd>
			<dt><label for="6months">定期券 6箇月</label></dt>
			<dd>
				<p><input type="number" name="6months" id="6months" value={mo6Fare} onInput={e => setMo6Fare(e.currentTarget.value)} inputmode="numeric" min="0" /></p>
				<Result result={calc(normalFare, mo6Fare, 6)} />
			</dd>
		</dl>
	);
};

interface ResultProps extends PreactDOMAttributes {
	result: ResultStruct
}
const Result = (props: ResultProps) => {
	if (props.result.error !== undefined) {
		return (<p><output>{props.result.error}</output></p>);
	}
	return (
		<p>
			<output>片道{props.result.oneWay}回以上 / 往復{props.result.roundTrip}回以上</output>
			<br />
			<output>1ヶ月あたり片道{props.result.oneWayPerMonth}回以上 / 往復{props.result.roundTripPerMonth}回以上</output>
		</p>
	);
};

type ResultStruct = {
	oneWay: number
	roundTrip: number
	oneWayPerMonth: number
	roundTripPerMonth: number
	error?: undefined
} | {
	error: string
}

const numProc = (n: number, d = 0) => Math.ceil(Math.round(1000 * n) / 1000 * (10 ** d)) / (10 ** d);
const calc = (normalStr: string, passStr: string, month: number): ResultStruct => {
	if (passStr === "") return { error: "定期券代を入力してください" };

	if (!passStr.match(/^[0-9]+$/)) return { error: "定期券代が正しくありません" };
	const pass = parseInt(passStr);
	if (pass <= 0) return { error: "定期券代が0円以下では計算できません" };
	if (!Number.isSafeInteger(pass)) return { error: "定期券代に入力可能な数値を超えています" };

	if (checkNormalFare(normalStr)?.error) return { error: "" };
	const normal = parseInt(normalStr);

	if (normal > pass) return { error: "定期券代よりも運賃の方が高額です" };
	return {
		oneWay: numProc(pass / normal),
		roundTrip: numProc(pass / normal / 2),
		oneWayPerMonth: numProc(pass / normal / month, 1),
		roundTripPerMonth: numProc(pass / normal / 2 / month, 1)
	}
};

const checkNormalFare = (normalStr: string) => {
	if (normalStr === "") return { error: "乗車券代を入力してください" };
	if (!normalStr.match(/^[0-9]+$/)) return { error: "乗車券代が正しくありません" };
	const normal = parseInt(normalStr);
	if (normal <= 0) return { error: "乗車券代が0円以下では計算できません" };
	if (!Number.isSafeInteger(normal)) return { error: "乗車券代に入力可能な数値を超えています" };
};

export const meta: AppModuleMeta = {
	hasCSS: true
};
