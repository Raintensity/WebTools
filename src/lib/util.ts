export const zPad = (n: number, l: number) => ([...Array(l)].join("0") + n).slice(-l);

export class DateEx extends Date {
	private offset = new Date().getTimezoneOffset();

	clone() {
		const d = new DateEx(super.getTime());
		d.setOffset(this.offset);
		return d;
	}

	getOffset() {
		return this.offset;
	}

	setOffset(offset: number) {
		this.offset = offset;
	}

	addOffset() {
		super.setUTCMinutes(super.getUTCMinutes() - this.offset);
	}

	removeOffset() {
		super.setUTCMinutes(super.getUTCMinutes() + this.offset);
	}

	getOffsetFullYear() {
		const d = this.clone();
		d.addOffset();
		return d.getUTCFullYear();
	}

	setOffsetFullYear(year: number) {
		this.addOffset();
		super.setUTCFullYear(year);
		this.removeOffset();
	}

	getOffsetMonth() {
		const d = this.clone();
		d.addOffset();
		return d.getUTCMonth();
	}

	setOffsetMonth(month: number) {
		this.addOffset();
		super.setUTCMonth(month);
		this.removeOffset();
	}

	getOffsetDate() {
		const d = this.clone();
		d.addOffset();
		return d.getUTCDate();
	}

	setOffsetDate(date: number) {
		this.addOffset();
		super.setUTCDate(date);
		this.removeOffset();
	}

	getOffsetHours() {
		const d = this.clone();
		d.addOffset();
		return d.getUTCHours();
	}

	setOffsetHours(hours: number) {
		this.addOffset();
		super.setUTCHours(hours);
		this.removeOffset();
	}

	getOffsetMinutes() {
		const d = this.clone();
		d.addOffset();
		return d.getUTCMinutes();
	}

	setOffsetMinutes(miutes: number) {
		this.addOffset();
		super.setUTCMinutes(miutes);
		this.removeOffset();
	}

	private static formatPriority = [
		"hh", "h", "mm", "m", "ss", "s",
		"dd", "d", "yyyy", "yy", "MM", "M"
	] as const;

	private static formatPatterns: { [name: string]: (date: Date) => string } = {
		hh: (date: Date) => zPad(date.getUTCHours(), 2),
		h: (date: Date) => date.getUTCHours() + "",
		mm: (date: Date) => zPad(date.getUTCMinutes(), 2),
		m: (date: Date) => date.getUTCMinutes() + "",
		ss: (date: Date) => zPad(date.getUTCSeconds(), 2),
		s: (date: Date) => date.getUTCSeconds() + "",
		dd: (date: Date) => zPad(date.getUTCDate(), 2),
		d: (date: Date) => date.getUTCDate() + "",
		yyyy: (date: Date) => date.getUTCFullYear() + "",
		yy: (date: Date) => zPad(date.getUTCFullYear() % 100, 2) + "",
		MM: (date: Date) => zPad(date.getUTCMonth() + 1, 2),
		M: (date: Date) => date.getUTCMonth() + 1 + ""
	} as const;

	format(pattern: string, offset?: number) {
		return DateEx.format(this, pattern, offset);
	}

	formatWithOffset(pattern: string) {
		return DateEx.format(this, pattern, this.getOffset());
	}

	static format(date: Date, pattern: string, offset?: number) {
		if (offset) {
			date = new Date(date.getTime() - offset * 60 * 1000);
		}
		return this.formatPriority.reduce((res, fmt) => {
			return res.replace(fmt, this.formatPatterns[fmt](date));
		}, pattern);
	}
}

export const IMPERIAL_JP = [
	{ name: "明治", begin: new Date(-3216790800000) },
	{ name: "大正", begin: new Date(-1812186000000) },
	{ name: "昭和", begin: new Date(-1357635600000) },
	{ name: "平成", begin: new Date(600188400000) },
	{ name: "令和", begin: new Date(1556636400000) }
] as const;
