import { test, expect } from "@playwright/test";

import { DashboardPage } from "./dashboard-page";
import { resetDatabase, uniqueCourseName } from "../helpers";

test.describe("Dashboard", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async () => {
    await resetDatabase();
  });

  test("instructor can create and open a course", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseName = uniqueCourseName();

    await dashboardPage.gotoDashboard();
    await dashboardPage.createCourse({
      courseName,
      department: "Computer Science",
      term: "2026W1",
    });

    await dashboardPage.expectCourseVisible(courseName);
    await dashboardPage.openCourse(courseName);

    await expect(page).toHaveURL(/\/courses\/\d+$/);
    await expect(page.getByRole("heading", { name: courseName })).toBeVisible();
  });

  test("instructor can delete a course from the dashboard", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseName = uniqueCourseName();

    await dashboardPage.gotoDashboard();
    await dashboardPage.createCourse({
      courseName,
      department: "Biology",
      term: "2026W1",
    });

    await dashboardPage.expectCourseVisible(courseName);
    await dashboardPage.deleteCourse(courseName);
    await dashboardPage.expectCourseNotVisible(courseName);
  });

  test("course errors show only after submit and include all invalid fields", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.gotoDashboard();
    await dashboardPage.submitEmptyCourse();

    await dashboardPage.expectCourseFieldError("Course name is required.");
    await dashboardPage.expectCourseFieldError("Choose a department from the list.");
    await dashboardPage.expectCourseFieldError("Term must use the YYYY[W|S][1|2] format.");

    await page.getByLabel("Term").fill("2026W");
    await expect(
      page.getByText("please match the requested format", { exact: false }),
    ).toHaveCount(0);
  });

  test("material errors show only after submit and include all invalid fields", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseName = uniqueCourseName();

    await dashboardPage.gotoDashboard();
    await dashboardPage.createCourse({
      courseName,
      department: "Computer Science",
      term: "2026W1",
    });
    await dashboardPage.openCourse(courseName);

    await page.getByRole("button", { name: "Add material" }).click();

    await expect(page.getByText("Title is required.")).toBeVisible();
    await expect(page.getByText("Description is required.")).toBeVisible();
    await expect(page.getByText("Enter a valid URL.")).toBeVisible();

    await page.getByLabel("Link").fill("not-a-url");
    await expect(page.getByText("please include an '@'", { exact: false })).toHaveCount(0);
  });

  test("instructor can add and delete a material", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseName = uniqueCourseName();

    await dashboardPage.gotoDashboard();
    await dashboardPage.createCourse({
      courseName,
      department: "Mathematics",
      term: "2026S2",
    });
    await dashboardPage.openCourse(courseName);

    await dashboardPage.addMaterial({
      title: "Week 1 Notes",
      type: "Lecture Notes",
      description: "Introductory concepts for the first week.",
      link: "https://example.com/week-1-notes",
    });

    await dashboardPage.expectMaterialVisible("Week 1 Notes");
    await dashboardPage.deleteFirstMaterial();

    await expect(page.getByText("Week 1 Notes")).not.toBeVisible();
  });

  test("deleting a material keeps the current scroll position", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseName = uniqueCourseName();

    await dashboardPage.gotoDashboard();
    await dashboardPage.createCourse({
      courseName,
      department: "Physics",
      term: "2026W2",
    });
    await dashboardPage.openCourse(courseName);

    for (let index = 1; index <= 10; index += 1) {
      await dashboardPage.addMaterial({
        title: `Scroll Test Material ${index}`,
        type: "Lecture Notes",
        description: `Material ${index} used to verify scroll position is preserved after deletion.`,
        link: `https://example.com/scroll-material-${index}`,
      });
    }

    const targetTitle = "Scroll Test Material 10";
    const targetCard = page.locator("article", { hasText: targetTitle }).first();

    await targetCard.scrollIntoViewIfNeeded();
    const scrollBeforeDelete = await page.evaluate(() => window.scrollY);

    await dashboardPage.deleteMaterial(targetTitle);

    await expect(page.getByText(targetTitle)).toHaveCount(0);

    const scrollAfterDelete = await page.evaluate(() => window.scrollY);
    expect(scrollAfterDelete).toBeGreaterThan(0);
    expect(Math.abs(scrollAfterDelete - scrollBeforeDelete)).toBeLessThan(200);
  });

  test("deleting a course keeps the current scroll position", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseNames: string[] = [];

    await dashboardPage.gotoDashboard();

    for (let index = 1; index <= 10; index += 1) {
      const courseName = uniqueCourseName();
      courseNames.push(courseName);

      await dashboardPage.createCourse({
        courseName,
        department: "English",
        term: `2026W${index % 2 === 0 ? 2 : 1}`,
      });
    }

    const targetCourse = courseNames.at(-1);

    if (!targetCourse) {
      throw new Error("Expected a target course to delete.");
    }

    const targetCard = page.locator("article", { hasText: targetCourse }).first();
    await targetCard.scrollIntoViewIfNeeded();

    const scrollBeforeDelete = await page.evaluate(() => window.scrollY);

    await dashboardPage.deleteCourse(targetCourse);
    await dashboardPage.expectCourseNotVisible(targetCourse);

    const scrollAfterDelete = await page.evaluate(() => window.scrollY);
    expect(scrollAfterDelete).toBeGreaterThan(0);
    expect(Math.abs(scrollAfterDelete - scrollBeforeDelete)).toBeLessThan(200);
  });

  test("adding a course keeps the current scroll position", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.gotoDashboard();

    for (let index = 1; index <= 10; index += 1) {
      await dashboardPage.createCourse({
        courseName: uniqueCourseName(),
        department: "Biology",
        term: `2026S${index % 2 === 0 ? 2 : 1}`,
      });
    }

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    const scrollBeforeCreate = await page.evaluate(() => window.scrollY);

    const newCourseName = uniqueCourseName();

    await page.evaluate(
      ({ courseName }) => {
        const form = document.querySelector('form.form-card') as HTMLFormElement | null;

        if (!form) {
          throw new Error("Create course form not found.");
        }

        const courseNameInput = form.querySelector('input[name="courseName"]') as HTMLInputElement | null;
        const departmentSelect = form.querySelector('select[name="department"]') as HTMLSelectElement | null;
        const termInput = form.querySelector('input[name="term"]') as HTMLInputElement | null;

        if (!courseNameInput || !departmentSelect || !termInput) {
          throw new Error("Create course fields not found.");
        }

        courseNameInput.value = courseName;
        departmentSelect.value = "Physics";
        termInput.value = "2026W1";
        form.requestSubmit();
      },
      { courseName: newCourseName },
    );

    await dashboardPage.expectCourseVisible(newCourseName);

    const scrollAfterCreate = await page.evaluate(() => window.scrollY);
    expect(scrollAfterCreate).toBeGreaterThan(0);
    expect(Math.abs(scrollAfterCreate - scrollBeforeCreate)).toBeLessThan(250);
  });

  test("adding a material keeps the current scroll position", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const courseName = uniqueCourseName();

    await dashboardPage.gotoDashboard();
    await dashboardPage.createCourse({
      courseName,
      department: "Physics",
      term: "2026S1",
    });
    await dashboardPage.openCourse(courseName);

    for (let index = 1; index <= 9; index += 1) {
      await dashboardPage.addMaterial({
        title: `Existing Material ${index}`,
        type: "Lecture Notes",
        description: `Existing material ${index}.`,
        link: `https://example.com/existing-material-${index}`,
      });
    }

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    const scrollBeforeAdd = await page.evaluate(() => window.scrollY);
    const newMaterialTitle = "Added While Scrolled Down";

    await page.evaluate(
      ({ title }) => {
        const form = document.querySelector('form.form-card') as HTMLFormElement | null;

        if (!form) {
          throw new Error("Add material form not found.");
        }

        const titleInput = form.querySelector('input[name="title"]') as HTMLInputElement | null;
        const typeSelect = form.querySelector('select[name="type"]') as HTMLSelectElement | null;
        const descriptionInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement | null;
        const linkInput = form.querySelector('input[name="link"]') as HTMLInputElement | null;

        if (!titleInput || !typeSelect || !descriptionInput || !linkInput) {
          throw new Error("Add material fields not found.");
        }

        titleInput.value = title;
        typeSelect.value = "Assignment";
        descriptionInput.value = "Material added while the page is scrolled down.";
        linkInput.value = "https://example.com/material-added-while-scrolled-down";
        form.requestSubmit();
      },
      { title: newMaterialTitle },
    );

    await dashboardPage.expectMaterialVisible(newMaterialTitle);

    const scrollAfterAdd = await page.evaluate(() => window.scrollY);
    expect(scrollAfterAdd).toBeGreaterThan(0);
    expect(Math.abs(scrollAfterAdd - scrollBeforeAdd)).toBeLessThan(250);
  });
});
