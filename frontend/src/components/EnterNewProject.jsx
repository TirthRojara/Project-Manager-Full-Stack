import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from "react-toastify";

import { uiActions } from "../Store/ui-slice";
import InputSign from "./UI/SignUp-LogIn/InputSign";
import { createNewProject, queryClient } from "../utils/http";
import { useNavigate } from "react-router-dom";


export default function EnterNewProject() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const token = useSelector(state => state.ui.token)


    const { mutate } = useMutation({
        mutationFn: createNewProject,

        onMutate: async ({ newProject, token }) => {

            await queryClient.cancelQueries({ queryKey: ['projectAll'] });
            const previousProjects = queryClient.getQueryData(['projectAll']) || [];

            const tempId = 'p555'

            const optimisticProject = {
                ...newProject,
                _id: tempId,
            };

            queryClient.setQueryData(['projectAll'], [...previousProjects, optimisticProject]);

            toast.success('Project created successfully!');

            return { previousProjects, tempId };
        },

        onError: (error, variables, context) => {
            console.log('error while create new project onErr')
            toast.error('Please try again.');
            console.log(error.code)
            console.log(error)
            queryClient.setQueryData(['projectAll'], context.previousProjects);

            if (error.code === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
                dispatch(uiActions.storeToken(''));
                navigate('/login');
                return;
            }
        },

        onSuccess: (data, variables, context) => {
            // Replace the optimistic (tempId) project with the real one from backend
            queryClient.setQueryData(['projectAll'], (oldProjects) => {
                return oldProjects.map((proj) =>
                    proj._id === context.tempId ? data : proj
                );
            });

            console.log('project created success')
            // toast.success('Project created successfully!');
        },

        onSettled: () => {
            queryClient.invalidateQueries(['projectAll']);
        }
    });




    function handleCancel() {
        dispatch(uiActions.EnterProjectCancelButton())
        console.log('cancel')
        navigate('..')
    }

    function handleCreateNewProject(event) {
        event.preventDefault();
        console.log('Create new Project click')

        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries())
        console.log(data)

        mutate({
            newProject: {
                projectName: data["project-name"],
            },
            token: token,
        });

    }

    return (
        <>
            {/* <div className=' flex justify-center items-center md:ml-[25%] w-full md:w-[75%] p-2 bg-[rgb(250,250,250)] ' > */}
            <div className=' relative  flex justify-center items-center h-[calc(100%-75px)] top-[260px]' >
                <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative bottom-[60px] md:bottom-0">
                    <form onSubmit={handleCreateNewProject}>
                        <InputSign type='text' title='Project Name' name='project-name' placeholder='Enter your project name' />
                        <div className="mt-5 flex gap-4">
                            <button

                                type="submit"
                                className="  cursor-pointer w-full  bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition duration-300"
                            >
                                Create new project
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className=" cursor-pointer w-full  bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition duration-300 "
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </>
    )
}




