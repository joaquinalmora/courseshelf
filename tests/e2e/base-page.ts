import { expect, type Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await expect(this.page).toHaveURL(new RegExp(path === "/" ? "http://127.0.0.1:3000/?$" : path));
  }
}
