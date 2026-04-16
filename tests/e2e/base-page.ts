import { expect, type Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);

    // Assert on the path so tests keep working if the local host or port changes.
    await expect(this.page).toHaveURL(new RegExp(`${path === "/" ? "/?$" : `${path}$`}`));
  }
}
