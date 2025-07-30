import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchdeleteAvatar, queryClient, fetchUploadAvatar } from "../utils/http";
import ModalLast from "./UI/ModalLast";

import avatarImg from '../assets/avatar.png'



export default function Avatar() {

    const navigate = useNavigate()
    const fileRef = useRef()

    const token = useSelector(state => state.ui.token)

    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileName, setFileName] = useState("Upload Image");

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['profileData'],
        queryFn: ({ signal }) => fetchUserProfile({ signal, token: token }),
        enabled: !!token,
    });

    const userId = data?._id || null;

    const { data: avatarUrl, isPending: avtIsPending, isError: isAvtErr, error: avtErr } = useQuery({
        queryKey: ['userAvatar', userId],
        queryFn: ({ signal }) => fetchUserAvatar({ userId, signal }),
        enabled: Boolean(userId),
        staleTime: 1000 * 60 * 60 * 2, // 2 hour
    });

    const profileSrc = (avtIsPending || isAvtErr || avtErr?.code === 404)
        ? avatarImg
        : avatarUrl;


    const { mutate: deleteAvatar } = useMutation({
        mutationFn: ({ token, userId }) => fetchdeleteAvatar({ token, userId }),

        onMutate: async () => {

            await queryClient.cancelQueries({ queryKey: ['userAvatar', userId] });

            const previousAvatar = queryClient.getQueryData(['userAvatar', userId]);


            queryClient.setQueryData(['userAvatar', userId], avatarImg);

            return { previousAvatar };
        },

        onError: (error, context) => {
            if (context?.previousAvatar !== undefined) {
                queryClient.setQueryData(['userAvatar', userId], context.previousAvatar);
            }
            console.log('on Error delete avatar')
            toast.error('Failed to remove avatar, Please try again.');
            console.log(error)
        },

        onSuccess: () => {
            console.log('Avatar deleted successfully.');
            toast.success('Avatar remove successfully!');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['userAvatar', userId] });
            console.log('delete avatar on settled')
        },
    });



    const { mutate: uploadAvatar, isPending: isUploading } = useMutation({
        mutationFn: ({ token, file }) => fetchUploadAvatar({ token, file }),

        onMutate: async ({ file }) => {
            await queryClient.cancelQueries({ queryKey: ['userAvatar', userId] });

            const previousAvatar = queryClient.getQueryData(['userAvatar', userId]);

            // create preview URL from file
            const previewUrl = URL.createObjectURL(file);
            queryClient.setQueryData(['userAvatar', userId], previewUrl);

            return { previousAvatar };
        },

        onError: (error,  context) => {
            if (context?.previousAvatar !== undefined) {
                queryClient.setQueryData(['userAvatar', userId], context.previousAvatar);
            }
            console.log('Failed to upload avatar');
            toast.error('Failed Please try again.');
        },

        onSuccess: () => {
            console.log('Avatar uploaded successfully!');
            toast.success('Avatar uploaded successfully!');
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['userAvatar', userId] });
        }
    });




    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
            setFileName(file.name);
            console.log("New file selected:", file.name);
        }
    }

    function handleRemoveAvatar() {
        console.log('Remove Avatar click')

        // setFileName('Upload Image')
        // setPreviewUrl(null)

        deleteAvatar({
            token,
            userId
        })

    }

    function handleSetAvatar() {
        const file = fileRef.current?.files[0];
        if (!file) {
            console.log('Please select a file first.');
            toast.warning('Please select a file first.');
            return;
        }

        uploadAvatar({ token, file });
    }


    return (
        <>
            <ModalLast>
                <div className=" p-4 flex items-center justify-center flex-col bg-white gap-3">
                    <img
                        className="border-0 h-[250px] w-[250px] rounded-[250px]"
                        src={previewUrl || profileSrc}
                        alt=""
                    />
                    <div className="border-0 w-[40%] ">

                        <label
                            htmlFor="fileUpload"
                            className="w-full inline-block text-center cursor-pointer flex-1 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                            {fileName.length > 20 ? fileName.slice(0, 17) + "..." : fileName}

                        </label>

                        <input
                            ref={fileRef}
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                    </div>
                    <div className="w-[40%]">
                        <button
                            onClick={handleRemoveAvatar}
                            className="  w-full inline-block px-4 py-2 bg-red-500 text-white font-semibold rounded cursor-pointer hover:bg-red-600 active:bg-red-700 transition duration-200"
                        >
                            Remove Avatar
                        </button>
                    </div>
                    <div className="border-0 w-[80%] flex  gap-3 ">
                        <button
                            onClick={handleSetAvatar}
                            className=" cursor-pointer flex-1 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                            Set
                        </button>
                        <button
                            onClick={() => { navigate('..') }}
                            className=" cursor-pointer flex-1 bg-gray-500 text-white py-2 rounded font-semibold hover:bg-gray-600 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </ModalLast >
        </>
    )
}



















