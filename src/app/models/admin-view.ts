import { Admin } from "./admin";

export interface AdminView extends Admin{
    editMode: boolean;
    AddedMode: boolean;
}
