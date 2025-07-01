import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRef } from "react";

import { queryClient, createTask } from "../../utils/http";
import addSVG from '../../assets/add.svg'

export default function InputTask() {

    const navigate = useNavigate()
    const { projectId } = useParams();
    const ipTask = useRef()

    const token = useSelector(state => state.ui.token)

    const { mutate } = useMutation({
        mutationFn: ({ task, projectId, token }) =>
            createTask({ task, projectId, token }),

        onMutate: async ({ task, projectId }) => {
            const optimisticTask = { ...task, _id: 'temp-id-' + Date.now(), completed: false };

            const keysToUpdate = [
                ['tasks', projectId, false],
                ['tasks', projectId, undefined]
            ];

            const previousCache = {};

            for (const key of keysToUpdate) {
                await queryClient.cancelQueries({ queryKey: key });
                const previous = queryClient.getQueryData(key) || [];
                previousCache[key.join('|')] = previous;

                queryClient.setQueryData(key, [...previous, optimisticTask]);
            }

            return { previousCache, keysToUpdate };
        },

        onError: (_err, _vars, context) => {
            context.keysToUpdate.forEach((key) => {
                const joined = key.join('|');
                queryClient.setQueryData(key, context.previousCache[joined]);
            });
        },

        onSuccess: (realTask, _vars, context) => {
            if (!context) return;

            context.keysToUpdate.forEach((key) => {
                const tasks = queryClient.getQueryData(key) || [];

                const updatedTasks = tasks.map((task) =>
                    task._id.startsWith('temp-id') ? realTask : task
                );

                queryClient.setQueryData(key, updatedTasks);
            });

            console.log('task created successfully');
        },

        onSettled: (_data, _err, _vars, context) => {
            context.keysToUpdate.forEach((key) => {
                queryClient.invalidateQueries({ queryKey: key });
            });
        },
    });


    function handleAddClick() {
        const value = ipTask.current.value;
        console.log(value)
        console.log('input task add click')

        const task = {
            description: value
        }

        mutate({
            task,
            projectId,
            token
        });

        ipTask.current.value = '';
    }

    return (
        <>
            {/* Input task  */}
            <div className='md:w-[70%] mt-2 py-0 px-4 border-1 rounded-2xl flex items-center justify-between'>
                <input
                    className=" px-0 w-[90%] py-3 border-0 border-gray-300 rounded focus:outline-none "
                    type="text" placeholder='Add New Task' ref={ipTask}
                />
                <button
                    onClick={handleAddClick}
                    className=' cursor-pointer transition-transform duration-100 hover:scale-115 '
                >
                    <img src={addSVG} alt="" />
                </button>
            </div>
        </>
    )
}