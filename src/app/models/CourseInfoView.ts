import { CourseInDepartmentView } from "./CourseInDepartmentView"
export interface CourseInfoView {
    courseName: string
    courseCode: string
    prerequisites: string
    creditHour: number
    courses:CourseInDepartmentView[]
    addCourse: boolean
}