import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';

import { queryClient, fetchUserProfile } from "../utils/http";
import Modal from "../pages/Model";
import { uiActions } from "../Store/ui-slice";



export default function Profile({ onClose }) {

    const token = useSelector(state => state.ui.token)
    //  const token = localStorage.getItem('token');
    //  console.log(token)

    // const userData = queryClient.getQueryData(['profileData']);

    // Data fetching & http requests 

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['profileData'],
        queryFn: ({ signal }) => fetchUserProfile({ signal, token: token }),
         enabled: !!token,
    });

    if (isError) {
        console.log(error.message)
        console.log(error.code)

        if (error.code == 401) {
            navigate('/login')
        }
    }


    // Sample user data - you can replace this with props or state
    // const userData = {
    //     _id: "68466dc39d5d2e085bfc1e06",
    //     name: "Miles",
    //     email: "miles@gmail.com",
    //     age: 20,
    //     password: "asdfasd"
    // };



    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Show Profile Edit Model
    // Handle edidt button  

    function handleEditProfileOpen() {
        // dispatch(uiActions.toggleEditProfile(true))
        console.log('edit click')
        navigate('edit')
    }

    //

    function handleProfileClose() {
        // dispatch(uiActions.profileClose())
        navigate('..')
    }

    // http requests ...

    // const { data, isPending, isError, error } = useQuery({
    //     queryKey: ['profileData'],
    //     queryFn: ({ signal }) => fetchUserProfile({ signal, token: token }),
    // });

    return (
        <>

            <Modal open={true}>
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">User Profile</h2>

                    <div className="space-y-4">


                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Full Name</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded">
                                {isPending ? 'Loading...' : data?.name}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Email</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded">
                                {isPending ? 'Loading...' : data?.email}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Age</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded">
                                {isPending ? 'Loading...' : data?.age}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold text-gray-600">Password</label>
                            <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded font-mono">
                                {/* •••••••••••• */}
                                🤐🤐🤐🤐
                            </div>
                        </div>

                        {/* ERROR SPACE  */}

                        {/* <div>
                            <p>Enter valid email</p>
                            <p>Enter valid password</p>
                        </div> */}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleEditProfileOpen}
                                className=" cursor-pointer flex-1 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                            >
                                Edit Profile
                            </button>
                            <button
                                // onClick={onClose}
                                onClick={handleProfileClose}
                                className=" cursor-pointer flex-1 bg-gray-500 text-white py-2 rounded font-semibold hover:bg-gray-600 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                </div>


            </Modal>


        </>
    )
}

