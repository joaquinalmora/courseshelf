### E2E Tests: Dashboard and Course Management

**Suite ID:** `DASHBOARD-E2E`
**Feature:** Course creation, course navigation, and material management.

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

## Test Case: `DASHBOARD-E2E-002` - Add and delete a material

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
