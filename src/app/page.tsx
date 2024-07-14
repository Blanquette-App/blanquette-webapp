'use client'

import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss';
import { useState } from 'react';

export default function Home() {
    const [periodicity, setPeriodicity] = useState('d');
    const [lexicon, setLexicon] = useState('oss');

    const router = useRouter();
    const onClickCreationPage = () => {
        let key = `1.${periodicity}`;
        if (lexicon !== 'oss')
            key += `.${lexicon}`;
        key += `.${nanoid(5)}`;
        router.push(`/${key}`);
    }

    return (
        <div className={styles['form-key-creation']}>
            <label htmlFor="periodicity">Fréquence de changement du mot :</label>
            <select id="periodicity" value={periodicity}
                onChange={(e) => { setPeriodicity(e.target.value); }}
            >
                <option value="d">jour</option>
                <option value="w">semaine</option>
            </select>

            <label htmlFor="lexicon">Lexique :</label>
            <select id="lexicon" value={lexicon}
                onChange={(e) => { setLexicon(e.target.value); }}
            >
                <option value="oss">OSS 117</option>
                <option value="basic">Basique</option>
            </select>

            <button onClick={onClickCreationPage} className={styles['button']} disabled={false}>
                Créer une page
            </button>
        </div>
    );
}
