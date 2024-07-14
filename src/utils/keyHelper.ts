import Key, { KeyLexicon, keyLexicons, keyPeriodicities, KeyPeriodicity } from "@/models/key";
import { notFound } from "next/navigation";

export function getKey(keyParam: string): Key {
    const keyValues = keyParam?.split('.');
    if (!keyValues || keyValues.length < 3)
        notFound();
    const version = Number.parseInt(keyValues[0]);
    if (!Number.isInteger(version))
        notFound();

    if (!(keyPeriodicities as readonly string[]).includes(keyValues[1]))
        notFound();
    const periodicity = keyValues[1] as KeyPeriodicity;

    let lexicon: KeyLexicon = 'oss';
    if (keyValues.length > 3) {
        if (!(keyLexicons as readonly string[]).includes(keyValues[2]))
            notFound();
        lexicon = keyValues[2] as KeyLexicon;
    }

    return {
        version: version,
        lexicon: lexicon,
        periodicity: periodicity,
        seed: keyValues.slice(-1)[0]
    }
}