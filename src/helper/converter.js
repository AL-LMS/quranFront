import { ages, sex_for_class } from "../pages/dashboard/teacher/CourseData";
import { sex } from "../pages/dashboard/teacher/CourseData";
import { degree } from "../pages/dashboard/teacher/CourseData";
export function convert_ages(age) {
  if (age === 0) {
    return ages[0]["name"];
  }
  if (age === 1) {
    return ages[1]["name"];
  }
  if (age === 2) {
    return ages[2]["name"];
  }
}
export function convert_sex(gender) {
  if (gender === 0) {
    return sex_for_class[0]["name"];
  }
  if (gender === 1) {
    return sex_for_class[1]["name"];
  }
  if (gender === 2) {
    return sex_for_class[2]["name"];
  }
}
export function convert_degree(level) {
  if (level === 0) {
    return degree[0]["name"];
  }
  if (level === 1) {
    return degree[1]["name"];
  }
  if (level === 2) {
    return degree[2]["name"];
  }
  if (level === 3) {
    return degree[3]["name"];
  }
  if (level === 4) {
    return degree[4]["name"];
  }
}
