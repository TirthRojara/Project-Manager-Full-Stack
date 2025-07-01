import { useNavigate } from "react-router-dom"


export default function Welcome() {

    const navigate = useNavigate()

    function onSignup() {
        navigate('/signup')
    }
    function onLogin() {
        navigate('/login')
    }


    return (
        <>
            <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 to-purple-600 text-white flex items-center justify-center">
                <div className="text-center relative bottom-[60px]">
                    <h1 className=" text-5xl font-bold mb-12 transition duration-300 hover:scale-105 hover:text-yellow-300">
                        Welcome to Project Manager
                    </h1>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onSignup}
                            className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded cursor-pointer transition duration-300 hover:bg-indigo-600 hover:text-white hover:scale-105"
                        >
                            Sign up
                        </button>
                        <button
                            onClick={onLogin}
                            className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded cursor-pointer transition duration-300 hover:bg-indigo-600 hover:text-white hover:scale-105"
                        >
                            Log in
                        </button>
                    </div>
                </div>

            </div>


            <div className=" absolute top-[20px] left-[40%] text-white font-semibold flex flex-col  items-center">
                {/* <h2 className=" text-2xl">If yoy don't want to signup then use this email & password for login</h2> */}
                <h2 className=" text-2xl">For login use this Id & password</h2>
                <div>
                    <p className=" text-xl">email id : test@gmail.com</p>
                    <p className=" text-xl">password : test1234</p>
                </div>
            </div>


        </>
    )
}






