import { zPad } from "./util"

interface HolidayDef {
	name: string
	begin: Date
	until?: Date
}

type HolidayJP = HolidayDef & ({
	type: "date"
	month: number
	date: number
} | {
	type: "week"
	month: number
	nthWeek: number
} | {
	type: "calc"
	calc: (year: number) => Date
});

type Holiday = {
	date: Date
	name: string
};

const HOLIDAY_JP: HolidayJP[] = [
	{ name: "元日", type: "date", begin: new Date("1948-07-20"), month: 1, date: 1 },
	{ name: "成人の日", type: "date", begin: new Date("1948-07-20"), until: new Date("1999-12-31"), month: 1, date: 15 },
	{ name: "天皇誕生日", type: "date", begin: new Date("1948-07-20"), until: new Date("1989-02-16"), month: 4, date: 29 },
	{ name: "憲法記念日", type: "date", begin: new Date("1948-07-20"), month: 5, date: 3 },
	{ name: "こどもの日", type: "date", begin: new Date("1948-07-20"), month: 5, date: 5 },
	{ name: "文化の日", type: "date", begin: new Date("1948-07-20"), month: 11, date: 3 },
	{ name: "勤労感謝の日", type: "date", begin: new Date("1948-07-20"), month: 11, date: 23 },
	{ name: "建国記念の日", type: "date", begin: new Date("1967-06-25"), month: 2, date: 12 },
	{ name: "敬老の日", type: "date", begin: new Date("1967-06-25"), until: new Date("2002-12-31"), month: 9, date: 15 },
	{ name: "体育の日", type: "date", begin: new Date("1967-06-25"), until: new Date("1999-12-31"), month: 10, date: 10 },
	{ name: "天皇誕生日", type: "date", begin: new Date("1989-02-17"), until: new Date("2019-04-30"), month: 12, date: 23 },
	{ name: "みどりの日", type: "date", begin: new Date("1989-02-17"), until: new Date("2006-12-31"), month: 4, date: 29 },
	{ name: "海の日", type: "date", begin: new Date("1995-03-08"), until: new Date("2002-12-31"), month: 7, date: 20 },
	{ name: "成人の日", type: "week", begin: new Date("2000-01-01"), month: 1, nthWeek: 2 },
	{ name: "体育の日", type: "week", begin: new Date("2000-01-01"), until: new Date("2019-12-31"), month: 10, nthWeek: 2 },
	{ name: "海の日", type: "week", begin: new Date("2003-01-01"), until: new Date("2019-12-31"), month: 7, nthWeek: 3 },
	{ name: "敬老の日", type: "week", begin: new Date("2003-01-01"), month: 9, nthWeek: 3 },
	{ name: "昭和の日", type: "date", begin: new Date("2007-01-01"), month: 4, date: 29 },
	{ name: "みどりの日", type: "date", begin: new Date("2007-01-01"), month: 5, date: 4 },
	{ name: "山の日", type: "date", begin: new Date("2016-01-01"), until: new Date("2019-12-31"), month: 8, date: 11 },
	{ name: "天皇誕生日", type: "date", begin: new Date("2019-05-01"), month: 2, date: 23 },
	{ name: "海の日", type: "date", begin: new Date("2020-01-01"), until: new Date("2020-12-31"), month: 7, date: 23 },
	{ name: "スポーツの日", type: "date", begin: new Date("2020-01-01"), until: new Date("2020-12-31"), month: 7, date: 24 },
	{ name: "山の日", type: "date", begin: new Date("2020-01-01"), until: new Date("2020-12-31"), month: 8, date: 10 },
	{ name: "海の日", type: "date", begin: new Date("2021-01-01"), until: new Date("2021-12-31"), month: 7, date: 22 },
	{ name: "スポーツの日", type: "date", begin: new Date("2021-01-01"), until: new Date("2021-12-31"), month: 7, date: 23 },
	{ name: "山の日", type: "date", begin: new Date("2021-01-01"), until: new Date("2021-12-31"), month: 8, date: 8 },
	{ name: "海の日", type: "week", begin: new Date("2022-01-01"), month: 7, nthWeek: 3 },
	{ name: "スポーツの日", type: "week", begin: new Date("2022-01-01"), month: 10, nthWeek: 2 },
	{ name: "山の日", type: "date", begin: new Date("2022-01-01"), month: 8, date: 11 },

	{ name: "皇太子・明仁親王の結婚の儀", type: "date", begin: new Date("1959-03-17"), until: new Date("1959-04-10"), month: 4, date: 10 },
	{ name: "昭和天皇の大喪の礼", type: "date", begin: new Date("1989-02-17"), until: new Date("1989-02-24"), month: 2, date: 24 },
	{ name: "即位礼正殿の儀", type: "date", begin: new Date("1990-06-01"), until: new Date("1990-11-12"), month: 11, date: 12 },
	{ name: "皇太子・徳仁親王の結婚の儀", type: "date", begin: new Date("1993-04-30"), until: new Date("1993-06-09"), month: 6, date: 9 },
	{ name: "天皇の即位", type: "date", begin: new Date("2018-12-14"), until: new Date("2019-05-01"), month: 5, date: 1 },
	{ name: "即位礼正殿の儀", type: "date", begin: new Date("2018-12-14"), until: new Date("2019-10-22"), month: 10, date: 22 },

	{
		name: "春分の日", type: "calc", begin: new Date("1948-07-20"),
		calc(year) {
			if (year % 4 === 0) {
				if (year < 1960) return new Date(year + "-03-21");
				if (year < 2092) return new Date(year + "-03-20");
				if (year < 2100) return new Date(year + "-03-19");
				if (year < 2200) return new Date(year + "-03-20");
				if (year < 2224) return new Date(year + "-03-21");
				return new Date(year + "-03-20");
			} else if (year % 4 === 1) {
				if (year < 1992) return new Date(year + "-03-21");
				if (year < 2100) return new Date(year + "-03-20");
				if (year < 2124) return new Date(year + "-03-21");
				if (year < 2200) return new Date(year + "-03-20");
				if (year < 2256) return new Date(year + "-03-21");
				return new Date(year + "-03-20");
			} else if (year % 4 === 2) {
				if (year < 2024) return new Date(year + "-03-21");
				if (year < 2100) return new Date(year + "-03-20");
				if (year < 2156) return new Date(year + "-03-21");
				if (year < 2200) return new Date(year + "-03-20");
				if (year < 2288) return new Date(year + "-03-21");
				return new Date(year + "-03-20");
			} else {
				if (year < 2056) return new Date(year + "-03-21");
				if (year < 2100) return new Date(year + "-03-20");
				if (year < 2188) return new Date(year + "-03-21");
				if (year < 2200) return new Date(year + "-03-20");
				return new Date(year + "-03-21");
			}
		}
	},
	{
		name: "秋分の日", type: "calc", begin: new Date("1948-07-20"),
		calc(year) {
			if (year % 4 === 0) {
				if (year < 2012) return new Date(year + "-09-23");
				if (year < 2100) return new Date(year + "-09-22");
				if (year < 2140) return new Date(year + "-09-23");
				if (year < 2200) return new Date(year + "-09-22");
				if (year < 2264) return new Date(year + "-09-23");
				return new Date(year + "-09-22");
			} else if (year % 4 === 1) {
				if (year < 2044) return new Date(year + "-09-23");
				if (year < 2100) return new Date(year + "-09-22");
				if (year < 2168) return new Date(year + "-09-23");
				if (year < 2200) return new Date(year + "-09-22");
				if (year < 2292) return new Date(year + "-09-23");
				return new Date(year + "-09-22");
			} else if (year % 4 === 2) {
				if (year < 2076) return new Date(year + "-09-23");
				if (year < 2100) return new Date(year + "-09-22");
				return new Date(year + "-09-23");
			} else {
				if (year < 1980) return new Date(year + "-09-24");
				if (year < 2100) return new Date(year + "-09-23");
				if (year < 2104) return new Date(year + "-09-24");
				if (year < 2200) return new Date(year + "-09-23");
				if (year < 2228) return new Date(year + "-09-24");
				return new Date(year + "-09-23");
			}
		}
	},
] as const;

const isJPHolidayNormal = (date: Date) => {
	const t = new Date(Math.floor(date.getTime() / 86400000) * 86400000);
	for (const item of HOLIDAY_JP) {
		if (item.begin.getTime() > t.getTime()) continue;
		if (item.until && item.until.getTime() < t.getTime()) continue;
		if (item.type === "calc") {
			if (t.getTime() === item.calc(t.getUTCFullYear()).getTime()) return item.name;
		} else if (item.type === "week") {
			const d = new Date(t.getUTCFullYear() + "-" + zPad(item.month, 2) + "-01");
			d.setUTCDate((item.nthWeek - 1) * 7 + (8 - d.getUTCDay()) % 7 + 1);
			if (t.getTime() === d.getTime()) return item.name;
		} else {
			const d = new Date(t.getUTCFullYear() + "-" + zPad(item.month, 2) + "-" + zPad(item.date, 2));
			if (t.getTime() === d.getTime()) return item.name;
		}
	}
	return null;
};

export const isJPHoliday = (date: Date) => {
	const t = new Date(Math.floor(date.getTime() / 86400000) * 86400000);
	const normal = isJPHolidayNormal(t)
	if (normal) return normal;

	if (t.getTime() >= new Date("1973-04-12").getTime()) {
		const b = new Date(t.getTime());
		b.setUTCDate(b.getUTCDate() - 1);
		while (isJPHolidayNormal(b)) {
			if (b.getUTCDay() === 0 && isJPHolidayNormal(b)) return "振替休日";
			b.setUTCDate(b.getUTCDate() - 1);
		}
	}

	if (t.getTime() >= new Date("1985-12-27").getTime()) {
		const b = new Date(t.getTime() - 86400000);
		const a = new Date(t.getTime() + 86400000);
		if (isJPHolidayNormal(b) && isJPHolidayNormal(a)) return "国民の休日";
	}

	return null;
};

export const getJPHolidays = (year: number) => {
	const result: Holiday[] = [];
	const y = new Date(year + "-01-01");

	while (y.getUTCFullYear() === year) {
		const chk = isJPHoliday(y);
		if (chk) result.push({ date: new Date(y.getTime()), name: chk });
		y.setUTCDate(y.getUTCDate() + 1);
	}

	return result;
};
