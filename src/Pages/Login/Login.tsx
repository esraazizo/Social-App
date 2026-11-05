import { Button, FieldError, Input, Spinner, TextField } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { loginSchema, type loginSchemaType } from "../../lib/Schemas/AuthSchema";
import { loginUser } from "../../services/auth.services";
import { useContext } from "react";
import { TokenContext } from "../../Components/Context/TokenContext";

function Login() {
  const { setToken } = useContext(TokenContext)
  const navigate = useNavigate();
  const { register, handleSubmit,  formState: { errors, isSubmitting }, } = useForm<loginSchemaType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });
  async function submitData(values: loginSchemaType) {
    // console.log(values);
    try {
      const response = await loginUser(values);
      // console.log(response);
      //save token
      localStorage.setItem("UserToken",response.data.data.token)
      setToken(response.data.data.token);
      // console.log(response.data.message);
      toast.success(response.data.message)
      // console.log(response.data.data.token)
      setTimeout(() => { navigate("/") }, 10000)

    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log(error.response?.data.message);
        toast.error(error.response?.data.message)
      }
    }
  }
  return (
    <>
      <main>
        <section className="p-10 lg:p-15">
          <div className="bg-white p-5 lg:p-10 rounded-3xl">
            <h1 className="text-black text-[24px] font-bold tracking-tight">Log in to Route Posts</h1>
            <p className="mt-3 max-w-2xl text-[14px] text-slate-700">Log in and continue your social journey.</p>
            <form action="" className="space-y-5 pt-5" onSubmit={handleSubmit(submitData)}>
              <TextField className="w-full" isInvalid={Boolean(errors.email)} aria-label="Email">
                <Input {...register("email")} type="email" className="w-full" placeholder="Email" variant="secondary" autoComplete="email" />
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>
              <TextField className="w-full" isInvalid={Boolean(errors.password)} aria-label="password" >
                <Input {...register("password")} type="password" className="w-full" placeholder="Password" variant="secondary" autoComplete="password" />
                <FieldError>{errors.password?.message}</FieldError>
              </TextField>
              <Button className="bg-blue-900 w-full rounded-xl" type="submit">
                {isSubmitting ? <div className="flex gap-3"> <Spinner className="text-white" /> <p>Loading...</p> </div> : "Log In"}</Button>

            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default Login