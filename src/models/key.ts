export const keyLexicons = ["oss", "basic"] as const;
export type KeyLexicon = (typeof keyLexicons)[number];

export const keyPeriodicities = ["d", "w", "ws"] as const;
export type KeyPeriodicity = (typeof keyPeriodicities)[number];

export default interface Key {
	version: number;
	lexicon: KeyLexicon;
	periodicity: KeyPeriodicity;
	seed: string;
}
