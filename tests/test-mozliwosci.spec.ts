import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:3000"; // Adres serwera Express.js

// Przykładowy formularz rejestracyjny
const sampleForm = {
    name: "Jan Kowalski",
    email: "kowalski@example.com",
    password: "haslodziwnemaslo123",
};

// Test dodawania formularza rejestracyjnego
test("Dodawanie formularza rejestracyjnego", async ({ page }) => {
    // Otwórz stronę z formularzem
    await page.goto(baseUrl);

    // Wypełnij formularz
    await page.fill("#name", sampleForm.name);
    await page.fill("#email", sampleForm.email);
    await page.fill("#password", sampleForm.password);

    // Wyślij formularz
    await page.click('button:has-text("Wyślij")');

    // Sprawdź, czy formularz został dodany
    const listItem = await page.waitForSelector(
        `li:has-text("${sampleForm.email}")`
    );
    expect(listItem).toBeTruthy(); // Sprawdź, czy element jest na liście
});

// Test sprawdzania duplikatu e-maila
test("Duplikat e-maila", async ({ page }) => {
    // Dodaj ten sam formularz ponownie
    await page.goto(baseUrl);
    await page.fill("#name", sampleForm.name);
    await page.fill("#email", sampleForm.email); // Ten sam e-mail
    await page.fill("#password", sampleForm.password);

    // Wyślij formularz
    await page.click('button:has-text("Wyślij")');

    // Sprawdź, czy zwracany jest błąd 400 z komunikatem "podany email już istnieje"
    const errorMessage = await page.waitForSelector(
        'text="Podany email już istnieje"'
    );
    expect(errorMessage).toBeTruthy(); // Sprawdź, czy błąd jest widoczny
});

// Test usuwania formularza
test("Usuwanie formularza rejestracyjnego", async ({ page }) => {
    // Otwórz stronę
    await page.goto(baseUrl);

    // Usuń formularz na podstawie e-maila
    const deleteButton = await page.waitForSelector(
        `li:has-text("${sampleForm.email}") button:has-text("Usuń")`
    );
    await deleteButton.click();

    // Sprawdź, czy formularz został usunięty
    const listItem = await page.$(`li:has-text("${sampleForm.email}")`);
    expect(listItem).toBeNull(); // Sprawdź, czy element został usunięty
});
