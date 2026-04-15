export const DEPARTMENT = {
  COMPUTER_SCIENCE: "Computer Science",
  MATHEMATICS: "Mathematics",
  PHYSICS: "Physics",
  BIOLOGY: "Biology",
  ENGLISH: "English",
} as const;

export type Department = (typeof DEPARTMENT)[keyof typeof DEPARTMENT];

export const DEPARTMENT_OPTIONS = [
  DEPARTMENT.COMPUTER_SCIENCE,
  DEPARTMENT.MATHEMATICS,
  DEPARTMENT.PHYSICS,
  DEPARTMENT.BIOLOGY,
  DEPARTMENT.ENGLISH,
] as const;

export const MATERIAL_TYPE = {
  LECTURE_NOTES: "Lecture Notes",
  ASSIGNMENT: "Assignment",
  SYLLABUS: "Syllabus",
  OTHER: "Other",
} as const;

export type MaterialType = (typeof MATERIAL_TYPE)[keyof typeof MATERIAL_TYPE];

export const MATERIAL_TYPE_OPTIONS = [
  MATERIAL_TYPE.LECTURE_NOTES,
  MATERIAL_TYPE.ASSIGNMENT,
  MATERIAL_TYPE.SYLLABUS,
  MATERIAL_TYPE.OTHER,
] as const;

export const TERM_PATTERN = /^\d{4}[WS][12]$/;
