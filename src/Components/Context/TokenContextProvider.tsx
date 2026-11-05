import { useState } from "react";
import { TokenContext } from "./TokenContext"

function TokenContextProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("UserToken"));
    return (

        <TokenContext.Provider value={{ token, setToken }}  >
            {children}
        </TokenContext.Provider>
    )
}

export default TokenContextProvider