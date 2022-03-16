import { TPolos } from '../common/types'
//$  => '-'
//_ => ' '
export const FormatedPolo = (polo: TPolos) => {
    return polo.replace(/_/g, ' ').replace(/\$/,'-')
}