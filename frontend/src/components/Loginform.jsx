import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginFetch } from "../utils/http";
import InputSign from "./UI/SignUp-LogIn/InputSign"

const loginSchema = z.object({
    'login-email': z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email address"),
    // .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
    'login-password': z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
    // .min(6, "Password must be at least 6 characters long")
});

// type formFields = {
//     'login-email': string,
//     'login-password': string
// }


export default function LoginForm() {

    const navigate = useNavigate()

    // const { register, handleSubmit, formState: { errors } } = useForm<FormFields>()
    const {
        register,
        control,
        handleSubmit,
        setError,
        formState: {
            errors,
            isSubmitting,
            isSubmitted,
            touchedFields,
            dirtyFields
        }
    } = useForm({
        defaultValues: {
            // 'login-email': 'test@gmail.com',
            // 'login-password': 'test1234'
            'login-email': '',
            'login-password': ''
        },
        // mode: "onSubmit",
        // mode: "onBlur",
        // reValidateMode: "onBlur", // ⬅️ remove error while typing
        mode: "onChange",
        reValidateMode: "onChange", // ⬅️ remove error while typing
        resolver: zodResolver(loginSchema),
    })





    const { mutate, isPending } = useMutation({
        mutationFn: loginFetch,
        onSuccess: (data) => {
            navigate('/dashboard')
            console.log('log in successfull')
            toast.success('Log in successfull')
        },
        onError: (error) => {
            console.log('error while log in onError')
            console.log(error)
            toast.error('Unable to login')
        }

    })


    // function loginHandler(event) {
    //     event.preventDefault()
    //     console.log('login click')

    //     const fd = new FormData(event.target)
    //     const data = Object.fromEntries(fd.entries())
    //     console.log(data)

    //     mutate({
    //         email: data['login-email'],
    //         password: data['login-password']
    //     })

    // }

    function onSubmit(data) {
        try {
            console.log('Form submitted:', data);
            // throw new Error("errrrrrrrr")

            mutate({
                email: data['login-email'],
                password: data['login-password']
            })

        } catch (error) {
            // setError("login-email", { type: "manual", message: "Email is already taken." });
            setError("root", { type: "manual", message: "Login failed. Please try again." });
            // setError("root", { type: "manual", message: error.message });
        }

    }



    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Welcome Back</h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >

                        <Controller
                            name="login-email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputSign
                                    type="email"
                                    id="login-email"
                                    name="login-email"
                                    title="Email"
                                    placeholder="Enter your email"
                                    field={field}
                                    fieldState={fieldState}
                                    isSubmitted={isSubmitted}
                                    dirty={dirtyFields["login-email"]}
                                    touched={touchedFields["login-email"]}
                                />
                            )}
                        />
                        <Controller
                            name="login-password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputSign
                                    type="password"
                                    id="login-password"
                                    name="login-password"
                                    title="Password"
                                    placeholder="Enter your password"
                                    field={field}
                                    fieldState={fieldState}
                                    isSubmitted={isSubmitted}
                                    dirty={dirtyFields["login-password"]}
                                    touched={touchedFields["login-password"]}
                                />
                            )}
                        />





                        {/* <InputSign
                            type='email'
                            title='Email'
                            id='login-email'
                            name='login-email'
                            placeholder='Enter your email'
                            {...register('login-email', {
                                // required: true,
                                // required: "Email is required",
                                // pattern: {
                                //     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                //     message: "Invalid email address"
                                // }
                            })}
                        /> */}
                        {/* { errors['login-email'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['login-email'].message}</p>
                        )} */}
                        {/* {(isSubmitted || touchedFields['login-email']) && errors['login-email'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['login-email'].message}</p>
                        )} */}
                        {/* {(isSubmitted && errors['login-email']) || (touchedFields['login-email'] && errors['login-email']) && (
                            <p className="text-red-500 text-sm mt-1">{errors['login-email'].message}</p>
                        )} */}
                        {/* {((isSubmitted && !dirtyFields['login-email']) ||
                            (touchedFields['login-email'] && dirtyFields['login-email'])) &&
                            errors['login-email'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['login-email'].message}</p>
                            )} */}


                        {/* <InputSign
                            type='password'
                            title='Password'
                            id='login-password'
                            name='login-password'
                            placeholder='Enter your password'
                            {...register('login-password', {
                                // required: "Password is required",
                                // minLength: {
                                //     value: 7,
                                //     message: "Password must be at least 7 characters"
                                // }
                            })}
                        /> */}
                        {/* { errors['login-password'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['login-password'].message}</p>
                        )} */}
                        {/* {(isSubmitted || touchedFields['login-password']) && errors['login-password'] && (
                            <p className="text-red-500 text-sm mt-1">{errors['login-password'].message}</p>
                        )} */}
                        {/* {(isSubmitted && errors['login-password']) || (touchedFields['login-password'] && errors['login-password']) && (
                            <p className="text-red-500 text-sm mt-1">{errors['login-password'].message}</p>
                        )} */}
                        {/* {((isSubmitted && !dirtyFields['login-password']) ||
                            (touchedFields['login-password'] && dirtyFields['login-password'])) &&
                            errors['login-password'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['login-password'].message}</p>
                            )} */}




                        {/* <div>
                            <label htmlFor="login-email" className="block mb-1 font-semibold">Email</label>
                            <input
                                type="email"
                                id="login-email"
                                name="login-email"
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="block mb-1 font-semibold">Password</label>
                            <input
                                type="password"
                                id="login-password"
                                name="login-password"
                                placeholder="Enter your password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div> */}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                            {isPending ? "Logging in..." : "Log In"}
                        </button>

                        {errors.root && (
                            <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>
                        )}
                    </form>
                    <div className="text-center mt-4 text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}