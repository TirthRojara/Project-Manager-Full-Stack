import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { createNewAccount } from "../utils/http";
import InputSign from "./UI/SignUp-LogIn/InputSign"


export default function Signup() {

    const navigate = useNavigate()


    const { mutate } = useMutation({
        mutationFn: createNewAccount,
        onSuccess: (data) => {
             navigate('/dashboard')
            console.log('sign up succecfull')
        },
        onError: (error) => {
            console.log('error while sign in onError')
            console.log(error)
        }

    })


    function handleSignup(event) {
        event.preventDefault()

        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries())
        console.log(data)
        // console.log(data["login-name"])

        // navigate('/dashboard')
        mutate({
            name: data["login-name"],
            email: data['login-email'],
            password: data['login-password']
        })
    }

    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center">
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
                    <form 
                    onSubmit={handleSignup}
                    className="space-y-4"
                    >
                        
                        <InputSign type='text' title='Full Name' id='login-name' name='login-name' placeholder='Enter your name' />
                        <InputSign type='email' title='Email' id='login-email' name='login-email' placeholder='Enter your email' />
                        <InputSign type='password' title='Password' id='login-password' name='login-password' placeholder='Enter your password' />


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
                            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                            Sign Up
                        </button>
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