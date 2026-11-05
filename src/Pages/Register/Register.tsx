import { Button, FieldError, Input, Spinner, TextField } from "@heroui/react"
import { ListBox, Select } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { registerSchema, type registerSchemaType } from "../../lib/Schemas/AuthSchema";
import { registerUser } from "../../services/auth.services";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors , isSubmitting } ,} = useForm<registerSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: ""
    }
  });
  async function submitData(values: registerSchemaType) {
    console.log(values);

    try {
      const response = await registerUser(values);
      console.log(response);
      console.log(response.data.message);
      toast.success(response.data.message)
      setTimeout(()=>{navigate("/auth")},3000)
      
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
        toast.error(error.response?.data.message) 
      }
    }
  }
  return (
    <>
      <main>
        <section className="p-8 ">
          <div className="bg-white p-10 rounded-3xl">
            <h1 className="text-blue-900 text-4xl font-bold tracking-tight">Create New Account</h1>
            <p className="mt-4 max-w-2xl text-xl text-slate-700">It is a quick and easy</p>
            <form action="" className="space-y-5 pt-5" onSubmit={handleSubmit(submitData)}>
              <TextField className="w-full" isInvalid={Boolean(errors.name)} aria-label="FullName">
                <Input {...register("name")} className="w-full" placeholder="Full name" variant="secondary" />
                <FieldError>{errors.name?.message}</FieldError>
              </TextField>
              <TextField className="w-full" isInvalid={Boolean(errors.username)} aria-label="UserName">
                <Input {...register("username")} className="w-full" placeholder="User name(optional" variant="secondary" autoComplete="user-name" />
                <FieldError>{errors.username?.message}</FieldError>
              </TextField>
              <TextField className="w-full" isInvalid={Boolean(errors.email)} aria-label="Email">
                <Input {...register("email")} type="email" className="w-full" placeholder="Email" variant="secondary" autoComplete="email" />
                <FieldError>{errors.email?.message}</FieldError>
              </TextField>
              <div className="flex flex-col gap-4">
                <TextField className="w-full" isInvalid={Boolean(errors.gender)} aria-label="gender">
                  <Controller name="gender" control={control} render={({ field }) => (
                    <Select {...field} aria-label="gender" className="w-full" placeholder="Select gender" variant="secondary">
                      <Select.Trigger>
                        {/* <Select.Value placeholder="Select gender" />  */}
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="male" textValue="Option 1">
                            male
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                          <ListBox.Item id="female" textValue="Option 2">
                            female
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )} />
                  <FieldError>{errors.gender?.message}</FieldError>
                </TextField>
              </div>
              <TextField className="w-full" isInvalid={Boolean(errors.dateOfBirth)} aria-label="date">
                <Input {...register("dateOfBirth")} className="w-full" type="date" variant="secondary" />
                <FieldError>{errors.dateOfBirth?.message}</FieldError>
              </TextField>
              <TextField className="w-full" isInvalid={Boolean(errors.password)} aria-label="password" >
                <Input {...register("password")} type="password" className="w-full" placeholder="Password" variant="secondary" autoComplete="password" />
                <FieldError>{errors.password?.message}</FieldError>
              </TextField>
              <TextField className="w-full" isInvalid={Boolean(errors.rePassword)} aria-label="newPassword">
                <Input {...register("rePassword")} type="password" className="w-full" placeholder="Confirm password" variant="secondary" autoComplete="repassword" />
                <FieldError>{errors.rePassword?.message}</FieldError>
              </TextField>
              <Button className="bg-blue-900 w-full rounded-xl" type="submit"> 
                {isSubmitting?<div className="flex gap-3"> <Spinner className="text-white"/> <p>Loading...</p> </div> : "Create New Account"}</Button>

            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default Register