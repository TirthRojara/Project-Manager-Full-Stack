import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createNewAccount } from "../utils/http";
import InputSign from "./UI/SignUp-LogIn/InputSign"


const signupSchema = z.object({
    'login-name': z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long"),
    'login-email': z
        .string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email address"),
    'login-password': z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
});


export default function Signup() {

    const navigate = useNavigate()

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
            'login-name': '',
            'login-email': '',
            'login-password': ''
        },
        mode: "onChange",
        reValidateMode: "onChange",
        resolver: zodResolver(signupSchema),
    })



    const { mutate, isPending } = useMutation({
        mutationFn: createNewAccount,
        onSuccess: (data) => {
            navigate('/dashboard')
            console.log('sign up successfull')
            toast.success('sign up successfull')
        },
        onError: (error) => {
            console.log('error while sign in onError')
            toast.error('Unable to sign in')
            console.log(error)
        }

    })


    // function handleSignup(event) {
    //     event.preventDefault()

    //     const fd = new FormData(event.target)
    //     const data = Object.fromEntries(fd.entries())
    //     console.log(data)
    //     // console.log(data["login-name"])

    //     // navigate('/dashboard')
    //     mutate({
    //         name: data["login-name"],
    //         email: data['login-email'],
    //         password: data['login-password']
    //     })
    // }

    function onSubmit(data) {
        try {
            console.log('Form submitted:', data);

            // throw new Error("errrrrrrrr");

            mutate({
                name: data['login-name'],
                email: data['login-email'],
                password: data['login-password']
            })

        } catch (error) {
            // setError("login-email", { type: "manual", message: "Email is already taken." });
            setError("root", { type: "manual", message: "Signup failed. Please try again." });
            // setError("root", { type: "manual", message: error.message });
        }

    }



    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
                    <form
                        // onSubmit={handleSignup}
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >

                        <Controller
                            name="login-name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <InputSign
                                    type="text"
                                    id="login-name"
                                    name="login-name"
                                    title="Full Name"
                                    placeholder="Enter your full name"
                                    field={field}
                                    fieldState={fieldState}
                                    isSubmitted={isSubmitted}
                                    dirty={dirtyFields["login-name"]}
                                    touched={touchedFields["login-name"]}
                                />
                            )}
                        />
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
                            {...register('login-name')}
                            type='text'
                            title='Full Name'
                            id='login-name'
                            name='login-name'
                            placeholder='Enter your name' />

                        {((isSubmitted && !dirtyFields['login-name']) ||
                            (touchedFields['login-name'] && dirtyFields['login-name'])) &&
                            errors['login-name'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['login-name'].message}</p>
                            )}

                        <InputSign
                            {...register('login-email')}
                            type='email'
                            title='Email'
                            id='login-email'
                            name='login-email'
                            placeholder='Enter your email' />

                        {((isSubmitted && !dirtyFields['login-email']) ||
                            (touchedFields['login-email'] && dirtyFields['login-email'])) &&
                            errors['login-email'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['login-email'].message}</p>
                            )}

                        <InputSign
                            {...register('login-password')}
                            type='password'
                            title='Password'
                            id='login-password'
                            name='login-password'
                            placeholder='Enter your password' />

                        {((isSubmitted && !dirtyFields['login-password']) ||
                            (touchedFields['login-password'] && dirtyFields['login-password'])) &&
                            errors['login-password'] && (
                                <p className="text-red-500 text-sm mt-1">{errors['login-password'].message}</p>
                            )} */}




                        {/* 
                        <div>
                            <label htmlFor="signup-name" className="block mb-1 font-semibold">Full Name</label>
                            <input
                                type="text"
                                id="signup-name"
                                name="signup-name"
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="signup-email" className="block mb-1 font-semibold">Email</label>
                            <input
                                type="email"
                                id="signup-email"
                                name="signup-email"
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="signup-password" className="block mb-1 font-semibold">Password</label>
                            <input
                                type="password"
                                id="signup-password"
                                placeholder="Enter your password"
                                required
                                minLength="7"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div> */}


                        <button
                            type="submit"
                            // onClick={handleSignup}
                            disabled={isPending}
                            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                            {isPending ? "Signing Up..." : "Sign Up"}
                        </button>

                        {errors.root && (
                            <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>
                        )}

                    </form>
                    <div className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>

        </>
    )
}