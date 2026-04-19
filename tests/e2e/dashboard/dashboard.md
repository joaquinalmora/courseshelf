### E2E Tests: Dashboard and Course Management

**Suite ID:** `DASHBOARD-E2E`
**Feature:** Course creation, course deletion, course navigation, submit-only validation, and material management.

---

## Test Case: `DASHBOARD-E2E-001` - Create and open a course

**Priority:** `critical`

**Tags:**
- type → @e2e
- feature → @dashboard

**Description/Objective:** Confirm an instructor can create a course from the dashboard and open its detail page.

**Preconditions:**
- Database is empty.

### Flow Steps:
1. Open the dashboard.
2. Submit a valid course.
3. Open the created course.

### Expected Result:
- The new course appears on the dashboard.
- The course detail page loads.

### Key verification points:
- Course name is visible on the dashboard.
- The URL changes to `/courses/:id`.

---

## Test Case: `DASHBOARD-E2E-002` - Delete a course from the dashboard

**Priority:** `critical`

**Tags:**
- type → @e2e
- feature → @dashboard

**Description/Objective:** Confirm an instructor can remove a course directly from the dashboard.

**Preconditions:**
- Database is empty.

### Flow Steps:
1. Open the dashboard.
2. Submit a valid course.
3. Delete the created course.

### Expected Result:
- The created course disappears from the dashboard.

### Key verification points:
- Course name is visible before deletion.
- Course name is not visible after deletion.

---

## Test Case: `DASHBOARD-E2E-003` - Submit-only course validation

**Priority:** `high`

**Tags:**
- type → @e2e
- feature → @dashboard

**Description/Objective:** Confirm course validation appears after submit and is handled by the app rather than browser-native pattern UI.

**Preconditions:**
- Database is empty.

### Flow Steps:
1. Open the dashboard.
2. Submit the empty course form.
3. Confirm all field errors appear.
4. Type a partial term value.

### Expected Result:
- Field errors appear after submit.
- Browser-native pattern text does not interrupt typing.

### Key verification points:
- Course, department, and term errors are visible.
- No browser-native pattern message appears for the partial term.

---

## Test Case: `DASHBOARD-E2E-004` - Add and delete a material

**Priority:** `critical`

**Tags:**
- type → @e2e
- feature → @dashboard

**Description/Objective:** Confirm an instructor can add a material to a course and remove it again.

**Preconditions:**
- Database is empty.

### Flow Steps:
1. Create a course.
2. Open the course.
3. Submit a valid material.
4. Delete the material.

### Expected Result:
- The new material appears on the course page.
- The deleted material disappears from the course page.

### Key verification points:
- Material title becomes visible after creation.
- Material title is no longer visible after deletion.
