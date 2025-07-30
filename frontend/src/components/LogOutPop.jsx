import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout } from "../utils/http";
import { uiActions } from "../Store/ui-slice";
import ModalLast from "./UI/ModalLast";


export default function LogOutPop() {


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const token = useSelector(state => state.ui.token)

    const { mutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('expiration');
            navigate('/login')
            console.log('logout succecfull')
            toast.success('Logout successful')
        },
        onError: (error) => {
            console.log(error + ' error while logout onError');
            toast.error('Logout failed, please try again');

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
                toast.error('Server error during logout');
            }

            // You can still navigate to login if you want
            navigate('/login');
        }

    })


    function NoHandle() {
        console.log('logout pop no click')
        navigate('..')
    }

    function YesHandle() {
        mutate(token)
        console.log('logout yes click')
    }

    return (
        <>
            <ModalLast>
                <div>

                    <div>
                        <p
                            className=" text-xl font-semibold"
                        >
                            Are you sure you want to logout of this device?
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

                    <div className="text-center mt-4 text-sm">
                        Logout of all devices?{" "}
                        <Link to="/dashboard/logoutall" className="text-indigo-600 font-semibold hover:underline">
                            Logout All
                        </Link>
                    </div>

                </div>
            </ModalLast>
        </>
    )
}





