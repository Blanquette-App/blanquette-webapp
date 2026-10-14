import { addDays, format, isMonday, isSaturday, isSunday } from "date-fns";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type Key from "@/models/key";
import { getCurrentWordByKey, getHistoricWordByKey } from "./actions";
import wordsFrBasic from "./words-fr-basic.json";
import wordsFrOss from "./words-fr-oss.json";

const dailyKey: Key = {
	version: 1,
	lexicon: "oss",
	periodicity: "d",
	seed: "abcde",
};
const weeklyKey: Key = { ...dailyKey, periodicity: "w" };
const sundayWeeklyKey: Key = { ...dailyKey, periodicity: "ws" };
const basicKey: Key = { ...dailyKey, lexicon: "basic" };

// Wednesday 2026-10-14, noon in Paris
const NOW = new Date("2026-10-14T10:00:00Z");

const day = (d: Date) => format(d, "yyyy-MM-dd");

describe("word generation", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("is deterministic for a given key and day", async () => {
		const a = await getCurrentWordByKey(dailyKey);
		const b = await getCurrentWordByKey(dailyKey);
		expect(a.word).toBe(b.word);
	});

	// Guards against dependency updates silently changing everyone's words
	it("keeps generating the same words as before", async () => {
		expect((await getCurrentWordByKey(dailyKey)).word).toMatchInlineSnapshot(
			`"Trésor"`,
		);
		expect((await getCurrentWordByKey(weeklyKey)).word).toMatchInlineSnapshot(
			`"Aigle"`,
		);
		expect((await getCurrentWordByKey(basicKey)).word).toMatchInlineSnapshot(
			`"Ciseaux"`,
		);
	});

	it("picks words from the key's lexicon", async () => {
		expect(wordsFrOss).toContain((await getCurrentWordByKey(dailyKey)).word);
		expect(wordsFrBasic).toContain((await getCurrentWordByKey(basicKey)).word);
	});

	it("uses a single day period for daily keys", async () => {
		const { period } = await getCurrentWordByKey(dailyKey);
		expect(period.type).toBe("d");
		expect(day(period.start)).toBe("2026-10-14");
		expect(day(period.end)).toBe("2026-10-14");
	});

	it("uses a monday to sunday period for weekly keys", async () => {
		const { period } = await getCurrentWordByKey(weeklyKey);
		expect(day(period.start)).toBe("2026-10-12");
		expect(day(period.end)).toBe("2026-10-18");
	});

	it("uses a sunday to saturday period for ws keys", async () => {
		const { period } = await getCurrentWordByKey(sundayWeeklyKey);
		expect(day(period.start)).toBe("2026-10-11");
		expect(day(period.end)).toBe("2026-10-17");
	});

	it.each([
		["monday", "2026-10-12T10:00:00Z"],
		["sunday", "2026-10-18T10:00:00Z"],
	])("keeps the same weekly word on %s", async (_, now) => {
		const wednesdayWord = (await getCurrentWordByKey(weeklyKey)).word;
		vi.setSystemTime(new Date(now));
		const { word, period } = await getCurrentWordByKey(weeklyKey);
		expect(word).toBe(wednesdayWord);
		expect(isMonday(period.start)).toBe(true);
		expect(isSunday(period.end)).toBe(true);
	});

	it("changes the weekly period on the next monday", async () => {
		vi.setSystemTime(new Date("2026-10-19T10:00:00Z"));
		const { period } = await getCurrentWordByKey(weeklyKey);
		expect(day(period.start)).toBe("2026-10-19");
	});

	it("follows the Paris timezone", async () => {
		// 23:30 UTC on Wednesday is already Thursday in Paris
		vi.setSystemTime(new Date("2026-10-14T23:30:00Z"));
		const { period } = await getCurrentWordByKey(dailyKey);
		expect(day(period.start)).toBe("2026-10-15");
	});

	it("returns the 6 previous days for daily keys", async () => {
		const history = await getHistoricWordByKey(dailyKey);
		expect(history.map((w) => day(w.period.start))).toEqual([
			"2026-10-13",
			"2026-10-12",
			"2026-10-11",
			"2026-10-10",
			"2026-10-09",
			"2026-10-08",
		]);
	});

	it("returns the 3 previous weeks for weekly keys", async () => {
		const history = await getHistoricWordByKey(sundayWeeklyKey);
		expect(history.map((w) => day(w.period.start))).toEqual([
			"2026-10-04",
			"2026-09-27",
			"2026-09-20",
		]);
		for (const { period } of history) {
			expect(isSunday(period.start)).toBe(true);
			expect(isSaturday(period.end)).toBe(true);
		}
	});

	it("history matches what was the current word on that day", async () => {
		const [yesterday] = await getHistoricWordByKey(dailyKey);
		vi.setSystemTime(addDays(NOW, -1));
		expect((await getCurrentWordByKey(dailyKey)).word).toBe(yesterday.word);
	});
});
