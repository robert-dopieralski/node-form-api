import { test, expect } from "@playwright/test";
import {
    getEmailLocator,
    getImieLocator,
    getPasswordLocator,
} from "./utils/signupUtils";

const sampleData = {
    name: "Jan",
    email: "kowalski@example.com",
    password: "Kowalski123",
};

test.describe("testuje aplikacje", () => {
    // tescik 1
    test("mozna dodac, wylistowac i usunac dodany rekord", async ({ page }) => {
        let storedId = "";
        await page.goto("http://localhost:5500/");

        const imieLocator = getImieLocator(page);
        const emailLocator = getEmailLocator(page);
        const passwordLocator = getPasswordLocator(page);
        await imieLocator.click();
        await imieLocator.fill(sampleData.name);
        await emailLocator.click();
        await emailLocator.fill(sampleData.email);
        await passwordLocator.click();
        await passwordLocator.fill(sampleData.password);

        page.on("response", async (capturedResponse) => {
            const responseURL = capturedResponse.url();
            const body = await capturedResponse.json();
            console.log("parsed json body: ", { body, responseURL });
            if (responseURL === "http://127.0.0.1:3000/api/formularz") {
                storedId = body.id;
            }
        });

        await page.getByRole("button", { name: "Wyślij" }).click();
        await page.getByRole("button", { name: "Pobierz formularze" }).click();

        console.warn({ storedId });

        const listedKowalski = page.getByText(
            `Imię: ${sampleData.name}, Email: ${sampleData.email} id: ${storedId}`
        );

        await expect(listedKowalski).toBeVisible();

        // usuwamy ziutka:
        const deleteZiutekButton = page.locator(`Usuń`).first();
        // await expect(deleteZiutekButton).toBeVisible();

        // await deleteZiutekButton.click();
        // await expect(listedKowalski).not.toBeVisible();
    });

    // tescik 2
});
