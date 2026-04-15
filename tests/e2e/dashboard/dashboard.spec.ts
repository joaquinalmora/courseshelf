import { test, expect } from "@playwright/test";

import { DashboardPage } from "./dashboard-page";
import { resetDatabase, uniqueCourseName } from "../helpers";

test.describe("Dashboard", () => {
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
});
