import styles from './page.module.scss';
import { getCurrentWordByKey, getHistoricWordByKey } from './actions';
import { getKey } from '@/utils/keyHelper';

export default async function Page({ params }: Readonly<{ params: { key: string } }>) {
    const key = getKey(params.key);
    const currentWord = await getCurrentWordByKey(key);
    const oldWords = await getHistoricWordByKey(key);
    const dateFormater = new Intl.DateTimeFormat('fr-FR',
        {
            weekday: 'short',
            day: 'numeric',
            month: key.periodicity === 'd' ? undefined : 'long'
        });

    return (
        <>
            <div className={styles['current-word']}>
                {currentWord.word}
            </div>

            <div className={styles['word-history']}>
                <div className={styles['title']}>Historique :</div>
                <div className={styles['grid']}>
                    {oldWords.map((word) => {
                        const date = dateFormater.format(word.period.start);
                        return (
                            <div key={date} className={styles['row']}>
                                <div>- {date} :</div><div>{word.word}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
