import { expect, type Page } from "@playwright/test";

import { BasePage } from "../base-page";

interface CourseInput {
  courseName: string;
  department: string;
  term: string;
}

interface MaterialInput {
  title: string;
  type: string;
  description: string;
  link: string;
}

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoDashboard(): Promise<void> {
    await super.goto("/");
  }

  async createCourse(input: CourseInput): Promise<void> {
    await this.page.getByLabel("Course name").fill(input.courseName);
    await this.page.getByLabel("Department").selectOption(input.department);
    await this.page.getByLabel("Term").fill(input.term);
    await this.page.getByRole("button", { name: "Create course" }).click();
  }

  async openCourse(courseName: string): Promise<void> {
    const courseCard = this.page.locator("article", { hasText: courseName }).first();
    await courseCard.getByRole("link", { name: "Open course" }).click();
  }

  async addMaterial(input: MaterialInput): Promise<void> {
    await this.page.getByLabel("Title").fill(input.title);
    await this.page.getByLabel("Type").selectOption(input.type);
    await this.page.getByLabel("Description").fill(input.description);
    await this.page.getByLabel("Link").fill(input.link);
    await this.page.getByRole("button", { name: "Add material" }).click();
  }

  async expectCourseVisible(courseName: string): Promise<void> {
    await expect(this.page.getByText(courseName)).toBeVisible();
  }

  async expectMaterialVisible(title: string): Promise<void> {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async deleteFirstMaterial(): Promise<void> {
    await this.page.getByRole("button", { name: "Delete material" }).first().click();
  }
}
