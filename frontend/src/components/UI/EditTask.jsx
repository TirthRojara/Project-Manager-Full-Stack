import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from '@tanstack/react-query';

import { queryClient, fetchUpdateTaskName, fetchTasksByProject } from "../../utils/http";
import { uiActions } from "../../Store/ui-slice";
import Modal from "../../pages/Model";
import ModalLast from "./ModalLast";



export default function EditTask() {

    console.log('edit task mount ')
    const preValue = 'Before Edit'

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { taskId, projectId } = useParams()

    const token = useSelector(state => state.ui.token)




    const { data: tasks, isPending: isPendingTaQu, isError: isErrorTaQu, error: errorTaQu } = useQuery({
        queryKey: ['tasks', projectId, undefined],
        queryFn: ({ signal }) => fetchTasksByProject({
            signal,
            token,
            projectId,
            // completed: getCompletedFilter()
            completed: undefined
        }),
        enabled: !!token
    });



    const { mutate: updateTask } = useMutation({
        mutationFn: ({ projectId, taskId, changeName, token }) =>
            fetchUpdateTaskName({ projectId, taskId, changeName, token }),

        onMutate: async ({ taskId, changeName, completedValue }) => {
            const keysToUpdate = [
                ['tasks', projectId, undefined],
                // ['tasks', projectId, currentTask?.completed ? 'true' : 'false']
                ['tasks', projectId, completedValue ? 'true' : 'false']
            ];

            const previousCache = {};

            for (const key of keysToUpdate) {
                await queryClient.cancelQueries({ queryKey: key });
                const previous = queryClient.getQueryData(key) || [];
                previousCache[key.join('|')] = previous;

                const updated = previous.map(task =>
                    task._id === taskId ? { ...task, ...changeName } : task
                );

                queryClient.setQueryData(key, updated);
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

            navigate('..')
        }
    });




    const currentTask = tasks?.find(t => t._id === taskId)
    // const completedValue = currentTask?.completed

    if (!currentTask) return null;
  

   
    const completedValue = currentTask?.completed;

    //  useEffect(() => {
    //     if (currentTask?.description) {
    //         setTaskInput(currentTask.description);
    //     }
    // }, [currentTask]);



    function handleEdit(event) {
        event.preventDefault();
        console.log('Edit save click')
        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries())
        console.log(data.task)
        console.log(completedValue)

        const changeName = {
            description: data.task
        };

        updateTask({
            projectId,
            taskId,
            token,
            changeName,
            completedValue
        });

    }



    // const isEditTaskClick = useSelector(state => state.ui.isEditTaskClick)


    function handleEditClose() {
        console.log('Edit task close click')
        // dispatch(uiActions.EditTaskClickCalcel())
        navigate('..')
    }




    return (
        <>
            <ModalLast
                // open={isEditTaskClick}
                // open={usefor === 'task' ? isEditTaskClick : isEditProjectClick}
                // onClose={handleEditClose}
            >
                <form onSubmit={handleEdit}>
                    <div>
                        <label htmlFor="profile-name" className="block mb-1 font-semibold">Task</label>
                        <input
                            type="text"
                            name="task"
                            // value={preValue}
                            defaultValue={currentTask?.description || 'Loading...'}
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
            </ModalLast>
        </>
    )
}






