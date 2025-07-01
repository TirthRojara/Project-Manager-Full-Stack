import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { queryClient, fetchUpdateTaskName } from "../../utils/http";
import { uiActions } from '../../Store/ui-slice';
import editSVG from '../../assets/edit.svg'
import deleteSVG from '../../assets/delete.svg'


export default function Task({ taskTitle, checked, taskId }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { taskId: tId , projectId } = useParams()

    const token = useSelector(state => state.ui.token)

    const [isChecked, setIsChecked] = useState(checked);




    const { mutate: updateTask } = useMutation({
        mutationFn: ({ projectId, taskId, changeName, token }) =>
            fetchUpdateTaskName({ projectId, taskId, changeName, token }),

        onMutate: async ({ taskId, changeName, newChecked }) => {
            const keysToUpdate = [
                ['tasks', projectId, undefined],
                ['tasks', projectId, newChecked ]
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

        onError: (error, _vars, context) => {
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

            
        }
    });








    function handleCheckboxChange(e) {
        // setIsChecked(prev => !prev);
        console.log(taskId)

        const newChecked = e.target.checked;
        setIsChecked(newChecked);

        const changeName = {
            completed: newChecked
        };

        console.log(newChecked)
        console.log(changeName.completed)

        updateTask({
            projectId,
            taskId,
            token,
            changeName,
            newChecked
        });

    }

    function handleEditTask() {
        // dispatch(uiActions.EditTaskClick())
        console.log('Task Edit click')
        navigate(`${taskId}/edit`)
    }

    // delete 

    function handleDelete() {
        console.log('Task delete click')
        console.log(taskId)
        // dispatch(uiActions.deleteFor('Task'))
        navigate(`${taskId}/delete`)
    }


    return (
        <>
            <div className='border-b flex items-center justify-between p-3 '>
                <div className='flex items-center w-[75%] gap-4'>
                    <input
                        type="checkbox"
                        name="terms"
                        id={taskId}
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className=" peer h-5 w-5 cursor-pointer rounded border-gray-300 "
                    />
                    <label htmlFor={taskId} className="py-1 border-0 items-center w-[100%] cursor-pointer  peer-checked:line-through peer-checked:text-gray-400">
                        {taskTitle} 
                        {/* : {checked ? 'true' : 'false'} */}
                    </label>
                </div>
                <div className='flex gap-5'>
                    <button
                        onClick={handleEditTask}
                        className=' cursor-pointer transition-transform duration-100 hover:scale-115 '
                    >
                        <img src={editSVG} alt="" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className=' cursor-pointer transition-transform duration-100 hover:scale-115 '
                    >
                        <img src={deleteSVG} alt="" />
                    </button>
                </div>
            </div>
        </>
    )
}