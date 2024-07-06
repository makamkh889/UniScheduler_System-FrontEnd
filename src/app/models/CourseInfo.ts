import { CourseInDepartment } from "./CourseInDepartment"

export interface CourseInfo {
    courseName: string
    courseCode: string
    prerequisites: string
    creditHour: number
    courses:CourseInDepartment[]
}