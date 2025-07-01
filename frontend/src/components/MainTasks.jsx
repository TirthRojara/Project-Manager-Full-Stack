import { use, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { queryClient, fetchTasksByProject, fetchAllProject } from '../utils/http'
import { TASK_DATA } from '../assets/data'
import { uiActions } from '../Store/ui-slice'
import menuSVG from '../assets/menu.svg'
import Task from './UI/Task'
import InputTask from './UI/InputTask'

const td = []


export default function MainTasks() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { projectId } = useParams()

    const token = useSelector(state => state.ui.token)
    // const currentProjectName = useSelector(state => state.ui.currentProjectName)


    const { data: allProjects, isPending: pNamePending, isError: ISpNameError, error: pNameError } = useQuery({
        queryKey: ['projectAll'],
        queryFn: ({ signal }) => fetchAllProject({ signal, token: token }),
        enabled: !!token,
    });

    const currentProject = allProjects?.find(p => p._id === projectId);
    


    const [isCompletedClick, setIsCompletedClick] = useState(false)
    const [isRemainingClick, setIsRemainingClick] = useState(false)


    const getCompletedFilter = () => {
        if (isCompletedClick) return 'true'
        if (isRemainingClick) return 'false'
        return undefined // No filter - fetch all tasks
    }


    const { data: tasks = [], isPending, isError, error } = useQuery({
        queryKey: ['tasks', projectId, getCompletedFilter()],
        queryFn: ({ signal }) => fetchTasksByProject({
            signal,
            token,
            projectId,
            completed: getCompletedFilter()
        }),
        enabled: !!token && !!projectId,
    });


    // ['tasks', projectId, getCompletedFilter()]
    //   ↓         ↓            ↓
    // Static   Dynamic    Dynamic
    // string   variable   function result


    // When page first loads (no filter active)
    // ['tasks', 'project123', undefined]

    // When "Completed" button is clicked
    // ['tasks', 'project123', 'true']

    // When "Remaining" button is clicked  
    // ['tasks', 'project123', 'false']

    // Different project, no filter
    // ['tasks', 'project456', undefined]


    // Cache: {
    //   "['tasks', 'project123', undefined]": [task1, task2, task3, task4], // All tasks
    //   "['tasks', 'project123', 'true']": [task2, task4],                  // Completed only  
    //   "['tasks', 'project123', 'false']": [task1, task3]                  // Remaining only
    // }


    // Fillter button 

    function handleCompletedBtn() {
        setIsCompletedClick(prev => !prev)
        setIsRemainingClick(false)
    }

    function handleRemainingBtn() {
        setIsRemainingClick(prev => !prev)
        setIsCompletedClick(false)
    }

    let fillterBtnClassWhenClick = 'cursor-pointer px-4 py-2 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 shadow-sm'
    let fillterBtnClassWhenNotClick = 'cursor-pointer px-4 py-2 rounded-xl font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-300 shadow-sm'




    return (
        <>
            {/* Deshboard-content-right-side  */}
            {/* <div className='md:ml-[25%] w-full md:w-[75%] p-2 bg-[rgb(250,250,250)] ' > */}
            <div className='md:ml-3 p-1 ml-[-5px]  z-[1000000]'>
                {/* menu-SVG  */}
                {/* <div className='block md:hidden p-4 '>
                    <button onClick={showMenuHandler}> <img className='h-8 w-8 cursor-pointer ' src={menuSVG} alt="" /></button>
                </div> */}

                {/* main-content  */}

                {/* project name  */}
                <div className='p-4 border-0'>
                    <h1 className='text-4xl font-semibold'>{currentProject?.projectName || "Loading..."}</h1>
                </div>

                {/* Input task  */}
                <InputTask />

                {/* Fillter Buttons / Completed / Remaining  */}
                <div className=' ml-1 mt-5 space-x-4'>
                    <button
                        onClick={handleCompletedBtn}
                        className={isCompletedClick ? fillterBtnClassWhenClick : fillterBtnClassWhenNotClick}
                    // className="px-4 py-2 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 shadow-sm"
                    >
                        Completed
                    </button>
                    <button
                        onClick={handleRemainingBtn}
                        className={isRemainingClick ? fillterBtnClassWhenClick : fillterBtnClassWhenNotClick}
                    // className="px-4 py-2 rounded-xl font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors duration-300 shadow-sm"
                    >
                        Remaining
                    </button>
                </div>

                {/* tasks  */}
                <div className='border-0 h-[66%] md:h-[74%] md:w-[80%] mt-5 overflow-y-scroll [&::-webkit-scrollbar]:hidden   [-ms-overflow-style:none]   [scrollbar-width:none]  md:[scrollbar-width:auto]  md:[-ms-overflow-style:auto]  md:[&::-webkit-scrollbar]:block   md:[&::-webkit-scrollbar]:w-2 md:[&::-webkit-scrollbar-thumb]:bg-gray-400  md:[&::-webkit-scrollbar-thumb]:rounded-full'>
                    <ul>

                        {/* {tasks.map((task) => (
                            <li key={task._id}>
                                <Task taskTitle={task.description} checked={task.completed} />
                            </li>

                        ))} */}

                        {isPending && (
                            <li className='p-4 text-center text-gray-500'>
                                <p>Loading...</p>
                            </li>
                        )}

                        {tasks.length === 0 ? (
                            <li className='p-4 text-center text-gray-500'>
                                {isCompletedClick ? 'No completed tasks' :
                                    isRemainingClick ? 'No remaining tasks' :
                                        'No tasks found'}
                            </li>
                        ) : (
                            tasks.map((task) => (
                                <li key={task._id}>
                                    <Task taskTitle={task.description} checked={task.completed} taskId={task._id} />
                                </li>
                            ))
                        )}


                    </ul>
                </div>
            </div>

             <Outlet />
        </>
    )
}




