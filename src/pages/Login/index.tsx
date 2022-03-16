import { useState } from 'react'
import { useAuth } from '../../context/Auth'
import * as S from './style'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const [email, setEmail ] = useState('')
    const [passsword, setPassword ] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSign = async() => {
        try {
            await signInWithEmailAndPassword(auth, email, passsword)
            login()
            navigate('/forms')
        }catch(err: any){
            if(err.code === 'auth/invalid-email'){
                alert('Email inválido')
            }else if(err.code === 'auth/wrong-password'){
                alert('Senha incorreta')
            }
           
        }
    }
    return (
        <S.Container onSubmit={(event) => event.preventDefault()}>
        
                <h1>Login</h1>
                <input type="text" placeholder="Email" onChange={(ev) => setEmail(ev.target.value)}/>
                <input type="password" placeholder="Senha" onChange={(ev) => setPassword(ev.target.value)}/>
                <button onClick={handleSign}>Entrar</button>
        </S.Container>
    )
}