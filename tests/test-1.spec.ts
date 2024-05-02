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
        let storedId = ""; // tutaj trzymamy id utworzonego konta dla testow
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

        const listedKowalski = page.getByText(
            `Imię: ${sampleData.name}, Email: ${sampleData.email} id: ${storedId}`
        );

        await expect(listedKowalski).toBeVisible();

        // usuwamy ziutka:
        // łapiemy element nadrzędny który zawiera dane ziutka i ma swoje ID w htmlu
        const listItemLocator = page.locator(`id=${storedId}`);

        // w złapanym elemencie znajdujemy button do usuwania
        const deleteZiutekButton = listItemLocator.getByRole("button", {
            name: "Usuń",
        });

        // spodziewamy sie, ze button jest widoczny
        await expect(deleteZiutekButton).toBeVisible();

        // dusimy button
        await deleteZiutekButton.click();

        // ziutek nie powinien byc juz widoczny
        await expect(listedKowalski).not.toBeVisible();
    });

    // tescik 2
});
