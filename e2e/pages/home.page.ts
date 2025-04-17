import { type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly navigationLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { level: 1 });
    this.navigationLinks = page.getByRole("navigation").getByRole("link");
  }

  async goto() {
    await this.page.goto("/");
  }

  async clickNavigationLink(text: string) {
    await this.navigationLinks.getByText(text).click();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("networkidle");
  }
}
