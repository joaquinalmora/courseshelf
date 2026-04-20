### E2E Tests: Dashboard and Course Management

**Suite ID:** `DASHBOARD-E2E`
**Feature:** Course creation, course deletion, course navigation, submit-only validation, material management, delete-confirmation preferences, and scroll preservation.

---

## Test Case: `DASHBOARD-E2E-001` - Create and open a course
**Priority:** `critical`
**Description/Objective:** Confirm an instructor can create a course from the dashboard and open its detail page.
**Key verification points:** Course card becomes visible, URL changes to `/courses/:id`, course heading is visible on the detail page.

## Test Case: `DASHBOARD-E2E-002` - Delete a course from the dashboard
**Priority:** `critical`
**Description/Objective:** Confirm an instructor can delete a course from the dashboard after confirming the dialog.
**Key verification points:** Delete dialog appears, delete action succeeds, course card disappears.

## Test Case: `DASHBOARD-E2E-003` - Submit-only course validation
**Priority:** `high`
**Description/Objective:** Confirm course validation errors appear only after submit and browser-native pattern messaging does not interrupt typing.
**Key verification points:** Course name, department, and term errors appear after empty submit; partial term input does not show browser-native validation text.

## Test Case: `DASHBOARD-E2E-004` - Submit-only material validation
**Priority:** `high`
**Description/Objective:** Confirm material validation errors appear only after submit and browser-native URL validation text does not interrupt typing.
**Key verification points:** Title, description, and link errors appear after clicking Add material; typing an invalid URL does not show browser-native email-style validation text.

## Test Case: `DASHBOARD-E2E-005` - Add and delete a material
**Priority:** `critical`
**Description/Objective:** Confirm an instructor can add a material to a course and remove it again.
**Key verification points:** Material title becomes visible after creation; delete dialog appears; material disappears after confirmation.

## Test Case: `DASHBOARD-E2E-006` - Disable the course delete dialog for the session
**Priority:** `medium`
**Description/Objective:** Confirm the course delete confirmation can be disabled for the rest of the current browser session.
**Key verification points:** First delete shows the dialog; selecting “Don't show this again on this device” suppresses the dialog for the next course deletion in the same session.

## Test Case: `DASHBOARD-E2E-007` - Disable the material delete dialog for the session
**Priority:** `medium`
**Description/Objective:** Confirm the material delete confirmation can be disabled for the rest of the current browser session.
**Key verification points:** First material delete shows the dialog; selecting “Don't show this again on this device” suppresses the dialog for the next material deletion in the same session.

## Test Case: `DASHBOARD-E2E-008` - Preserve scroll when deleting a material
**Priority:** `high`
**Description/Objective:** Confirm deleting a material keeps the user near the same scroll position on a long course page.
**Key verification points:** Target material is removed, `window.scrollY` stays above zero, and the post-delete scroll offset stays close to the pre-delete position.

## Test Case: `DASHBOARD-E2E-009` - Preserve scroll when deleting a course
**Priority:** `high`
**Description/Objective:** Confirm deleting a course keeps the user near the same scroll position on a long dashboard page.
**Key verification points:** Target course is removed, `window.scrollY` stays above zero, and the post-delete scroll offset stays close to the pre-delete position.

## Test Case: `DASHBOARD-E2E-010` - Preserve scroll when adding a course
**Priority:** `high`
**Description/Objective:** Confirm creating a course while scrolled down does not jump the dashboard back to the top.
**Key verification points:** New course becomes visible, `window.scrollY` stays above zero, and the post-create scroll offset stays close to the pre-submit position.

## Test Case: `DASHBOARD-E2E-011` - Preserve scroll when adding a material
**Priority:** `high`
**Description/Objective:** Confirm adding a material while scrolled down does not jump the course page back to the top.
**Key verification points:** New material becomes visible, `window.scrollY` stays above zero, and the post-create scroll offset stays close to the pre-submit position.
