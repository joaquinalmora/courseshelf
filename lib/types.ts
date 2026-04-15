import type { Department, MaterialType } from "@/lib/constants";

export interface CourseSummary {
  id: number;
  courseName: string;
  department: Department;
  term: string;
  materialCount: number;
}

export interface MaterialRecord {
  id: number;
  title: string;
  type: MaterialType;
  description: string;
  link: string;
}

export interface CourseDetail {
  id: number;
  courseName: string;
  department: Department;
  term: string;
  materials: MaterialRecord[];
}

export interface ApiMessage {
  message: string;
}
