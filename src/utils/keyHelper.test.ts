import { describe, expect, it } from "vitest";
import { getKey } from "./keyHelper";

function expectNotFound(fn: () => unknown) {
	expect(fn).toThrow(
		expect.objectContaining({ digest: expect.stringMatching(/;404$/) }),
	);
}

describe("getKey", () => {
	it("parses a key without lexicon, defaulting to oss", () => {
		expect(getKey("1.d.abcde")).toEqual({
			version: 1,
			lexicon: "oss",
			periodicity: "d",
			seed: "abcde",
		});
	});

	it("parses a key with an explicit lexicon", () => {
		expect(getKey("1.w.basic.a_b-c")).toEqual({
			version: 1,
			lexicon: "basic",
			periodicity: "w",
			seed: "a_b-c",
		});
	});

	it("accepts the sunday-starting week periodicity", () => {
		expect(getKey("2.ws.oss.xyz").periodicity).toBe("ws");
	});

	it.each([
		["too few parts", "1.d"],
		["non numeric version", "a.d.abcde"],
		["unknown periodicity", "1.m.abcde"],
		["unknown lexicon", "1.d.foo.abcde"],
		["empty string", ""],
	])("throws notFound for %s", (_, key) => {
		expectNotFound(() => getKey(key));
	});
});
