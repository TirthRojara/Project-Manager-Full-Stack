import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { queryClient, fetchUserProfile, fetchUpdateProfile } from "../utils/http";
import Modal from "../pages/Model";
import ModalLast from './UI/ModalLast';



export default function EditProfile() {
    // Sample user data - you can replace this with props or state

    // const userData = {
    //     _id: "68466dc39d5d2e085bfc1e06",
    //     name: "Miles",
    //     email: "miles@gmail.com",
    //     age: 20,
    //     password: "asdfasd"
    // };


    //    -------------------

    // const userData = queryClient.getQueryData(['profileData']);

    const token = useSelector(state => state.ui.token)
    // const token = localStorage.getItem('token');


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

    const { mutate } = useMutation({
        mutationFn: fetchUpdateProfile,
        onSuccess: (data) => {
            console.log('update profile successfull')
            toast.success('Profile update successfuly')
        },
        onError: (error, data, context) => {
            console.log('error while update profile onError')
            toast.error(`Can't update profile please try again`)
            console.log(error)
            queryClient.setQueryData(['profileData'], context.previousEvent);
        },
        onMutate: async (data) => {
            const newData = data.updateData;

            await queryClient.cancelQueries({ queryKey: ['profileData'] });
            const previousEvent = queryClient.getQueryData(['profileData']);

            queryClient.setQueryData(['profileData'], newData);

            return { previousEvent };
        },
        onSettled: () => {
            queryClient.invalidateQueries(['profileData']);
            navigate('..')
        },

    })


    const navigate = useNavigate()

    const handleEdit = (event) => {
        event.preventDefault();
        console.log("Save changes clicked");

        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries())
        console.log(data)
        const trimPass = data['profile-password'].trim()

        if (trimPass.length === 0) {
            console.log('0')

            mutate({
                updateData: {
                    name: data["profile-name"],
                    email: data["profile-email"],
                    age: data["profile-age"],
                },
                token: token,
            });

            return

        }

        mutate({
            updateData: {
                name: data["profile-name"],
                email: data["profile-email"],
                age: data["profile-age"],
                password: data["profile-password"],
            },
            token: token,
        });

    };



    function handleEditClose() {
        navigate('..')
    }




    if (!token || isPending) {
        return (
            <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p>Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ModalLast
            // open={true} 
            >

                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">User Profile</h2>

                    <form
                        onSubmit={handleEdit}
                        className="space-y-4"
                    >

                        <div>
                            <label htmlFor="profile-name" className="block mb-1 font-semibold">Full Name</label>
                            <input
                                type="text"

                                name="profile-name"
                                defaultValue={isPending ? 'Loading...' : data?.name}
                                placeholder="Enter your name"
                                className=" bg-gray-50 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-email" className="block mb-1 font-semibold">Email</label>
                            <input
                                type="email"

                                name="profile-email"
                                defaultValue={isPending ? 'Loading...' : data?.email}
                                placeholder="Enter your email"
                                className=" bg-gray-50 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-age" className="block mb-1 font-semibold">Age</label>
                            <input
                                type="number"

                                name="profile-age"
                                defaultValue={isPending ? 'Loading...' : data?.age}
                                placeholder="Enter your age"
                                className=" bg-gray-50 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-password" className="block mb-1 font-semibold">Password</label>
                            <input
                                type="password"

                                name="profile-password"
                                // value=''
                                placeholder="Enter new password if you want to change"
                                minLength="7"
                                className=" bg-gray-50 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleEditClose}
                                className="flex-1 bg-gray-500 text-white py-2 rounded font-semibold hover:bg-gray-600 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </form>

                </div>

            </ModalLast>
        </>
    );
}