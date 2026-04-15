import { z } from "zod";

import { DEPARTMENT_OPTIONS, MATERIAL_TYPE_OPTIONS, TERM_PATTERN } from "@/lib/constants";

export const courseSchema = z.object({
  courseName: z.string().trim().min(1, "Course name is required."),
  department: z.enum(DEPARTMENT_OPTIONS, {
    errorMap: () => ({ message: "Choose a department from the list." }),
  }),
  term: z
    .string()
    .trim()
    .regex(TERM_PATTERN, "Term must use the YYYY[W|S][1|2] format."),
});

export const materialSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  type: z.enum(MATERIAL_TYPE_OPTIONS, {
    errorMap: () => ({ message: "Choose a valid material type." }),
  }),
  description: z.string().trim().min(1, "Description is required."),
  link: z.string().trim().url("Enter a valid URL."),
});

export type CourseInput = z.infer<typeof courseSchema>;
export type MaterialInput = z.infer<typeof materialSchema>;

export function formatValidationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please review the form fields and try again.";
}
