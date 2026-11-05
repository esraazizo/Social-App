import type React from "react"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router"
import { TokenContext } from "../Context/TokenContext"

function AuthProtectedRoutes({ children }: { children: React.ReactNode }) {
    // const [token, setToken] = useState<string | null>(localStorage.getItem("UserToken"));
const {token} = useContext(TokenContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            navigate("/")
        }
    }, [token])
    return (
        <>{children}</>
    )
}

export default AuthProtectedRoutes