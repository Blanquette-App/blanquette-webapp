"use server";

import {
	format,
	isMonday,
	isSaturday,
	isSunday,
	nextSaturday,
	nextSunday,
	previousMonday,
	previousSunday,
	subDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { notFound } from "next/navigation";
import type Key from "@/models/key";
import type Period from "@/models/period";
import type WordWithPeriod from "@/models/wordWithPeriod";
import wordsFrBasic from "./words-fr-basic.json";
import wordsFrOss from "./words-fr-oss.json";

const periodDaysIntervals: Record<string, number> = {
	d: 1,
	w: 7,
	ws: 7,
};

export async function getCurrentWordByKey(key: Key) {
	return await getWordByKeyAndDate(key, getCurrentDate());
}

export async function getHistoricWordByKey(key: Key) {
	const numberOfWords = key.periodicity === "d" ? 6 : 3;
	const promises = Array.from(
		getPastPeriods(key, getCurrentDate(), numberOfWords),
	).map((pastPeriod) => getWordByKeyAndDate(key, pastPeriod));
	return await Promise.all(promises);
}

function getCurrentDate() {
	return toZonedTime(new Date(), "Europe/Paris");
}

async function getWordByKeyAndDate(
	key: Key,
	date: Date,
): Promise<WordWithPeriod> {
	const period = getPeriod(key, date);
	const periodNumber = await getDeterministicNumberByKeyAndDate(key, period);
	const dictionary = key.lexicon === "basic" ? wordsFrBasic : wordsFrOss;
	return {
		word: dictionary[periodNumber % dictionary.length],
		period,
	};
}

function getPeriod(key: Key, date: Date) {
	const period: Period = { type: key.periodicity, start: date, end: date };
	if (key.periodicity === "w") {
		// Week, starting on Monday
		period.start = isMonday(date) ? date : previousMonday(date);
		period.end = isSunday(date) ? date : nextSunday(date);
	} else if (key.periodicity === "ws") {
		// Week, starting on Sunday
		period.start = isSunday(date) ? date : previousSunday(date);
		period.end = isSaturday(date) ? date : nextSaturday(date);
	} else if (key.periodicity !== "d") {
		notFound();
	}
	return period;
}

async function getDeterministicNumberByKeyAndDate(
	key: Key,
	period: Period,
): Promise<number> {
	const periodId = format(period.start, "y-MM-dd");
	const hashHex = await getHash(`${key.seed}-${periodId}`);
	return parseInt(hashHex.slice(0, 8), 16); // Take first 8 characters of the hash as an integer
}

function* getPastPeriods(key: Key, currentDate: Date, numberOfPeriods: number) {
	let pastDate = currentDate;
	const periodDaysInterval = periodDaysIntervals[key.periodicity] || notFound();
	for (let i = 0; i < numberOfPeriods; i++) {
		pastDate = subDays(pastDate, periodDaysInterval);
		yield pastDate;
	}
}

async function getHash(input: string) {
	const hashBuffer = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(input),
	);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
