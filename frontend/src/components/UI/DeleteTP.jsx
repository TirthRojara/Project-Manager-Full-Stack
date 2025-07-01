import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect } from "react";

import { queryClient, fetchAllProject, fetchdeleteTask } from "../../utils/http";
import { fetchdeleteProject } from "../../utils/http";
import { uiActions } from "../../Store/ui-slice";
import ModalC from "./ModalC";
import ModalLast from "./ModalLast";


export default function DeleteTP({ title }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { projectId, taskId } = useParams();

    const token = useSelector(state => state.ui.token)
    // const currentProjectName = useSelector(state => state.ui.currentProjectName)

    const shouldEnableProject = !!token && title === 'Project';
    const shouldEnableTask = !!token && title === 'Task';

    const { data: allProjects, isPending: isPendingProQu, isError: isErrorProQu, error: errorProQu } = useQuery({
        queryKey: ['projectAll'],
        queryFn: ({ signal }) => fetchAllProject({ signal, token: token }),
        // enabled: !!token  
        enabled: shouldEnableProject
    });

    const currentProject = allProjects?.find(p => p._id === projectId);
    // console.log(allProjects)
    // console.log(currentProject)


    const { data: tasks, isPending: isPendingTaQu, isError: isErrorTaQu, error: errorTaQu } = useQuery({
        queryKey: ['tasks', projectId, undefined],
        queryFn: ({ signal }) => fetchTasksByProject({
            signal,
            token,
            projectId,
            completed: getCompletedFilter()
        }),
        enabled: shouldEnableTask,
    });

    const currentTask = tasks?.find(t => t._id === taskId)
    // const taskeName = currentTask.description
    // console.log(taskeName)
    // console.log(currentTask.completed)




    useEffect(() => {
        if (isErrorProQu) {
            console.log("Project query error:", errorProQu?.message);
        }

        if (isErrorTaQu) {
            console.log("Task query error:", errorTaQu?.message);
        }

        const error = errorProQu || errorTaQu;
        if (error?.code === 401) {
            navigate('/login');
        }
    }, [isErrorProQu, isErrorTaQu, errorProQu, errorTaQu, navigate]);





    const { mutate: deleteProject, isPending: isPendingProMut } = useMutation({
        mutationFn: fetchdeleteProject,

        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ['projectAll'] });

            const previousProjects = queryClient.getQueryData(['projectAll']) || [];

            // Optimistically remove the project from UI
            queryClient.setQueryData(['projectAll'], previousProjects.filter(p => p._id !== id));

            return { previousProjects };
        },

        onError: (error, variables, context) => {
            console.error('Error deleting project:', error);
            // Rollback optimistic update
            queryClient.setQueryData(['projectAll'], context.previousProjects);

            if (error.code === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
                dispatch(uiActions.storeToken(''));
                navigate('/login');
                return;
            }
        },

        onSuccess: () => {
            console.log('Project deleted successfully');
        },

        onSettled: () => {
            queryClient.invalidateQueries(['projectAll']);
            // navigate('/dashboard')
        }
    });


    const { mutate: deleteTask } = useMutation({
        mutationFn: ({ projectId, taskId, token }) =>
            fetchdeleteTask({ projectId, taskId, token }),

        onMutate: async ({ projectId, taskId, currentTask }) => {
            const keysToUpdate = [
                ['tasks', projectId, undefined],
                ['tasks', projectId, currentTask.completed ? 'true' : 'false']
            ];

            const previousCache = {};

            for (const key of keysToUpdate) {
                await queryClient.cancelQueries({ queryKey: key });
                const previous = queryClient.getQueryData(key) || [];
                previousCache[key.join('|')] = previous;

                queryClient.setQueryData(
                    key,
                    previous.filter(task => task._id !== taskId)
                );
            }

            return { previousCache, keysToUpdate };
        },

        onError: (_err, _vars, context) => {
            context?.keysToUpdate.forEach((key) => {
                const joined = key.join('|');
                queryClient.setQueryData(key, context.previousCache[joined]);
            });

            if (error.code === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiration');
                dispatch(uiActions.storeToken(''));
                navigate('/login');
                return;
            }
        },

        onSettled: (_data, _error, _vars, context) => {
            context?.keysToUpdate.forEach((key) => {
                queryClient.invalidateQueries({ queryKey: key });
            });
        },

        onSuccess: () => {
            console.log('Task deleted successfully');
        },
    });




    function deleteHandle() {
        if (title === 'Project') {
            console.log('delete click Project')
            console.log(projectId)

            deleteProject({
                id: projectId,
                token
            })

            navigate('/dashboard')
            return
        }

        if (title === 'Task') {
            console.log('delete click task')

            deleteTask({ projectId, taskId, token, currentTask })

            navigate('..')
            return
        }
    }

    function handleClose() {
        console.log('DeleteTP modalC close click')
        // dispatch(uiActions.deleteFor(''))
        navigate('..')
    }


    return (
        <>
            {/* <ModalC> */}
            <ModalLast>
                {/* <div className=" bg-[#e2e5eb] rounded-[6px] p-5 md:p-8 w-[400px] md:w-[30rem] relative bottom-8 md:bottom-0"> */}
                <div>
                    <p className="font-semibold text-xl mb-5">You want to delete this ?</p>
                    <div>
                        <label htmlFor="profile-name" className="block mb-1 font-semibold">{title}</label>
                        <div className=" bg-gray-50 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500">

                            {/* {currentProject?.projectName || "Loading..."} */}
                            {/* {currentTask?.description || "Loading..."} */}

                            {
                                title === 'Task'
                                    ? (currentTask?.description || "Loading...")
                                    : (currentProject?.projectName || "Loading...")
                            }


                        </div>
                    </div>
                    <div className="flex gap-2.5 mt-8">
                        <button
                            onClick={handleClose}
                            type="button"
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 active:bg-red-700"
                        >
                            Close
                        </button>
                        <button
                            onClick={deleteHandle}
                            className='w-full  bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 active:bg-red-700'
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {/* </div> */}
            </ModalLast>
            {/* </ModalC> */}
        </>
    )
}





