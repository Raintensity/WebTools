import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { AppMeta } from "lib/const";
import { zPad } from "lib/util";

export const meta: AppMeta = {
	minimalGlobalHeader: true
};

export const App = () => {
	const clockCanvasRef = useRef<HTMLCanvasElement>(null);
	const [timeStr, setTimeStr] = useState(format(Date.now()));
	const update = useCallback(() => setTimeStr(format(Date.now())), []);
	setAnimationFrame(update);

	useEffect(() => {
		if (!clockCanvasRef.current) return;
		const canvas = clockCanvasRef.current; // Not good
		const reRender = () => render(canvas, format(Date.now())); // Not good
		window.addEventListener("resize", reRender);
		return () => window.removeEventListener("resize", reRender);
	}, [clockCanvasRef]);

	useEffect(() => {
		if (!clockCanvasRef.current) return;
		render(clockCanvasRef.current, timeStr);
	}, [timeStr]);
	return (
		<div style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
			<canvas ref={clockCanvasRef}></canvas>
		</div>
	);
};

const render = (canvas: HTMLCanvasElement, timeStr: string) => {
	if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.dataset.fontSize = calcFontSize("'Hiragino Sans',sans-serif", canvas.width, canvas.height).toString();
	}
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const textColor = isDarkMode ? "#ccc" : "#333";

	ctx.font = canvas.dataset.fontSize + "px 'Hiragino Sans',sans-serif";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.fillStyle = textColor;
	ctx.fillText(timeStr, canvas.width / 2, canvas.height / 2);
};

const offset = new Date().getTimezoneOffset() * 60 * 1000;
const format = (date: number) => {
	return zPad(~~((date - offset) / 1000 / 60 / 60 % 24), 2)
		+ ":"
		+ zPad(~~((date - offset) / 1000 / 60 % 60), 2)
		+ ":"
		+ zPad(~~((date - offset) / 1000 % 60), 2);
};

const checkStr = "0123456789:";
const calcFontSize = (fontFamily: string, width: number, height: number) => {
	const dummyCanvas = document.createElement("canvas");
	const ctx = dummyCanvas.getContext("2d");
	if (!ctx) return 0;
	ctx.font = "100px " + fontFamily;
	const maxByChar = [...checkStr].reduce((p, c) => Math.max(p, ctx.measureText(c).width || 0), 0);
	const actualMaxWidth = maxByChar * 8; // 00:00:00
	return Math.min(width * 0.95 / actualMaxWidth, height * 0.95 / 100) * 100;
};

const setAnimationFrame = (callback: () => void) => {
	const id = useRef(0);
	const loop = useCallback(() => {
		id.current = window.requestAnimationFrame(loop);
		callback();
	}, [callback]);

	useEffect(() => {
		id.current = window.requestAnimationFrame(loop);
		return () => window.cancelAnimationFrame(id.current);
	}, [loop]);
};
