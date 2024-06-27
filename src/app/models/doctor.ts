import { DoctorOptions } from "./doctor-options"

export interface Doctor {
    name: string,
    department: string,
    email: string,
    nationalId: string
    courseNames: DoctorOptions[]
}
