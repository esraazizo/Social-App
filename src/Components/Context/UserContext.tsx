import type React from "react";
import { createContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { userProfileType } from "../../types/user.type";
import { getMyProfile } from "../../services/Profile.services";
import { useAuth } from "./TokenContext";

export type UserContextType = {
    userData: userProfileType | null;
    setUserData: Dispatch<SetStateAction<userProfileType | null>>
}

export const UserContext = createContext<UserContextType | null>(null)


export default function UserContextProvider({ children }: { children: React.ReactNode }) {

    const { token } = useAuth()


    const [userData, setUserData] = useState<userProfileType | null>(null)

    async function getUserProfile() {
        try {
            const { data } = await getMyProfile()
            // console.log(data);
            // console.log(data.data.user);
            setUserData(data.data.user)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (token) {
            getUserProfile()
        }
    }, [token])

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    )
}

