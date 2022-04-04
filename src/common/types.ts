import { POLOS_EXTENSOES } from "../constants/polos-extensoes";

export type TPolos = keyof typeof POLOS_EXTENSOES
export type Student = {
    course:string
    extensao: string
    institution: string
    institutionLocation: string
    name: string
    phone: string
    placing: string
    polo: string
    selectionType: string,
    id?:string
}