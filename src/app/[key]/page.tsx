import { getKey } from "@/utils/keyHelper";
import { getCurrentWordByKey, getHistoricWordByKey } from "./actions";
import styles from "./page.module.scss";

export default async function Page(
	props: Readonly<{ params: Promise<{ key: string }> }>,
) {
	const params = await props.params;
	const key = getKey(params.key);
	const currentWord = await getCurrentWordByKey(key);
	const oldWords = await getHistoricWordByKey(key);
	const dateFormater = new Intl.DateTimeFormat("fr-FR", {
		weekday: "short",
		day: "numeric",
		month: key.periodicity === "d" ? undefined : "long",
	});

	return (
		<>
			<div className={styles["current-word"]} data-testid="current-word">
				{currentWord.word}
			</div>

			<div className={styles["word-history"]}>
				<div className={styles.title}>Historique :</div>
				<div className={styles.grid}>
					{oldWords.map((word) => {
						const date = dateFormater.format(word.period.start);
						return (
							<div key={date} className={styles.row} data-testid="history-row">
								<div>- {date} :</div>
								<div>{word.word}</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
