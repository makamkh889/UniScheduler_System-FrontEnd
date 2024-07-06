import { doctorHomeOptions } from "./doctorHomeOptions"

export interface doctorHomeOptionsView extends doctorHomeOptions {
    AddCourseOption: boolean,
    EnrolledStudentsCount:number
    EditCourseOption: boolean,
}