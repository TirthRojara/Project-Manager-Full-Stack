import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { fetchdeleteAccount } from "../utils/http";
import ModalLast from "./UI/ModalLast";
import { uiActions } from "../Store/ui-slice";


export default function DeleteUserPop() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const token = useSelector(state => state.ui.token)

    const { mutate } = useMutation({
        mutationFn: fetchdeleteAccount,
        onSuccess: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('expiration');
            navigate('/login')
            console.log('delete account succecfull')
            toast.success('Account deleted successfully')
        },
        onError: (error) => {
            console.log(error + ' error while deleting account onError');
            toast.error('Error while deleting account, please try again');

            if (error.code === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
                dispatch(uiActions.storeToken(''));
                navigate('/login');
                return;
            }

            if (error.code === 500) {
                console.warn('Server error during logout');
                toast
            }

            navigate('/login');
        }

    })

    function NoHandle() {
        console.log('delete account No click')
        // dispatch(uiActions.deleteAccount(false))
        navigate('..')
    }

    function YesHandle() {
        mutate(token)
        console.log('delete acc yes click')
    }


    return (
        <>
            <ModalLast>
                <div>
                    <p
                        className=" text-xl font-semibold"
                    >Do you permanently want to delete the account ?</p>
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
            </ModalLast>
        </>
    )
}




