import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import { useAuth } from '../context/Auth'
import { Forms } from '../pages/Forms'
import { Login } from '../pages/Login'

export const RoutesApp = () => {
    const { signed } = useAuth()
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forms" element={signed ? <Forms /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    )
}