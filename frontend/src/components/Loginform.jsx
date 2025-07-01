import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query";

import { loginFetch } from "../utils/http";
import InputSign from "./UI/SignUp-LogIn/InputSign"


export default function LoginForm() {

    const navigate = useNavigate()

    const { mutate } = useMutation({
        mutationFn: loginFetch,
        onSuccess: (data) => {
            navigate('/dashboard')
            console.log('log in succecfull')
        },
        onError: (error) => {
            console.log('error while log in onError')
            console.log(error)
        }

    })


    function loginHandler(event) {
        event.preventDefault()
        console.log('login click')

        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries())
        console.log(data)

         mutate({ 
            email: data['login-email'],
            password: data['login-password']
        })

    }


    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Welcome Back</h2>
                    <form
                        onSubmit={loginHandler}
                        className="space-y-4"
                    >

                        <InputSign type='email' title='Email' id='login-email' name='login-email' placeholder='Enter your email' />
                        <InputSign type='password' title='Password' id='login-password' name='login-password' placeholder='Enter your password' />


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
                            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                            Log In
                        </button>
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