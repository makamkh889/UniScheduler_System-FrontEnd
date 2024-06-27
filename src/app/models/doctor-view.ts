import { DoctorOptionsView } from "./doctor-options-view"

export interface DoctorView {
    name: string,
    department: string,
    email: string,
    nationalId: string
    courseNames: DoctorOptionsView[]
    AddOption: boolean,
}
