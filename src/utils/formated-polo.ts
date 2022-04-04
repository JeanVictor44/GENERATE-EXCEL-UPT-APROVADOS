import { TPolos } from '../common/types'
//$  => '-'
//_ => ' '
const formatedPolo = (polo: TPolos) => {
    return polo.replace(/_/g, ' ').replace(/\$/,'-')
}

export default formatedPolo