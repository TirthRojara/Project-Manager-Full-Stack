import { useDispatch,useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { uiActions } from "../Store/ui-slice";
import { logoutAll } from "../utils/http";
import ModalLast from "./UI/ModalLast";


export default function LogOutPopAll() {

    const navigate = useNavigate()
    const dispatch = useDispatch

    const token = useSelector(state => state.ui.token)

     const { mutate } = useMutation({
            mutationFn: logoutAll,
            onSuccess: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
                navigate('/login')
                console.log('logout all succecfull')
            },
            onError: (error) => {
                console.log(error + ' error while logout onError');
    
                if (error.code === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('expiration');
                    dispatch(uiActions.storeToken(''));
                    navigate('/login');
                    return;
                }
    
                // Optional: handle 500 or others differently
                if (error.code === 500) {
                    console.warn('Server error during logout');
                }
    
                // You can still navigate to login if you want
                navigate('/login');
            }
    
        })

    function NoHandle() {
        console.log('log out all pop No click')
        navigate('/dashboard/logout')
    }

    function YesHandle() {
        mutate(token)
        console.log('logoutall yes click')
    }


    return (
        <>
            <ModalLast>
                <div>

                    <div>
                        <p
                            className=" text-xl font-semibold"
                        >
                            Are you sure you want to logout of all devices?
                        </p>
                    </div>

                    <div className="flex gap-2.5 mt-5 justify-end ">
                        <button
                            onClick={NoHandle}
                            type="button"
                            className="w-[20%] bg-gray-500 hover:bg-gray-600 text-white font-medium px-0 py-1.5 rounded-lg transition-colors duration-200 active:bg-gray-700"
                        >
                            NO
                        </button>
                        <button
                            onClick={YesHandle}
                            className='w-[20%]  bg-red-500 hover:bg-red-600 text-white font-medium px-0 py-1.5 rounded-lg transition-colors duration-200 active:bg-red-700'
                        >
                            Yes
                        </button>
                    </div>

                    {/* <div className="text-center mt-4 text-sm">
                        Logout of all devices?{" "}
                        <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                            Logout All
                        </Link>
                    </div> */}

                </div>
            </ModalLast>
        </>
    )
}





