import { test, expect } from "@playwright/test";
import { HomePage } from "./pages/home.page";

test.describe("Home Page", () => {
  test("should have correct title", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();

    await expect(page).toHaveTitle(/10x Gym Planner/);
  });

  test("should navigate to different pages", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Taking screenshot for visual comparison
    await expect(page).toHaveScreenshot("home-page.png");

    // Example navigation test - this would need to be adapted to your actual app
    // await homePage.clickNavigationLink('About');
    // await expect(page).toHaveURL(/.*about/);
  });
});
