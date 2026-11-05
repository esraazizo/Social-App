import type React from "react"
import { useContext, useEffect} from "react"
import { useNavigate } from "react-router"
import { TokenContext ,type TokenContextType } from "../Context/TokenContext"

function AppProtectedRoutes({ children }: { children: React.ReactNode }) {
    // const [token, setToken] = useState<string | null>(localStorage.getItem("UserToken"));
    const { token } :any = useContext<TokenContextType|null>(TokenContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate("/auth")
        }
    }, [token])

    return (
        <>{children}</>
    )
}

export default AppProtectedRoutes