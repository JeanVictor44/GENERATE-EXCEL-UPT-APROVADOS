import * as S from './style'
import logoImg from '../../assets/logo.png'

export const Header = () => {
    return (
        <S.Container>
            <img src={logoImg} />
            <h1>UPT APROVADOS</h1>
        </S.Container>
    )
}