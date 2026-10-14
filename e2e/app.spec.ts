import { expect, test } from "@playwright/test";

const SEED = "[A-Za-z0-9_-]{5}";

test.describe("home page", () => {
	test("creates a daily OSS 117 page by default", async ({ page }) => {
		await page.goto("/");
		await expect(page).toHaveTitle("Blanquette");
		await expect(
			page.getByLabel("Fréquence de changement du mot :"),
		).toHaveValue("d");
		await expect(page.getByLabel("Lexique :")).toHaveValue("oss");

		await page.getByRole("button", { name: "Créer une page" }).click();

		await expect(page).toHaveURL(new RegExp(`/1\\.d\\.${SEED}$`));
		await expect(page.getByTestId("current-word")).not.toBeEmpty();
		await expect(page.getByTestId("history-row")).toHaveCount(6);
	});

	test("creates a weekly basic page", async ({ page }) => {
		await page.goto("/");
		await page.getByLabel("Fréquence de changement du mot :").selectOption("w");
		await page.getByLabel("Lexique :").selectOption("basic");

		await page.getByRole("button", { name: "Créer une page" }).click();

		await expect(page).toHaveURL(new RegExp(`/1\\.w\\.basic\\.${SEED}$`));
		await expect(page.getByTestId("current-word")).not.toBeEmpty();
		await expect(page.getByTestId("history-row")).toHaveCount(3);
	});
});

test.describe("word page", () => {
	test("shows the same word for the same key", async ({ page }) => {
		await page.goto("/1.d.e2e-test");
		const word = await page.getByTestId("current-word").textContent();
		expect(word?.trim()).toBeTruthy();

		await page.reload();
		await expect(page.getByTestId("current-word")).toHaveText(word ?? "");
	});

	test("supports sunday-starting weeks", async ({ page }) => {
		await page.goto("/1.ws.oss.e2e-test");
		await expect(page.getByTestId("history-row")).toHaveCount(3);
	});

	for (const key of ["invalid", "1.x.abcde", "1.d.unknown.abcde"]) {
		test(`returns 404 for invalid key "${key}"`, async ({ page }) => {
			const response = await page.goto(`/${key}`);
			expect(response?.status()).toBe(404);
		});
	}
});
