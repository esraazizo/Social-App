import axios from "axios";
import type { loginSchemaType, registerSchemaType } from "../lib/Schemas/AuthSchema";

const baseUrl = import.meta.env.VITE_BASE_URL


export async function registerUser(formdata : registerSchemaType){
    const data = await axios.post(`${baseUrl}/users/signup`,formdata,{
        headers:{
            "Content-Type":"application/json"
        }
    }
    )

    return data
}


export async function loginUser(formdata : loginSchemaType){
    const data = await axios.post(`${baseUrl}/users/signin`,formdata,{
        headers:{
            "Content-Type":"application/json"
        }
    }
    )

    return data
}