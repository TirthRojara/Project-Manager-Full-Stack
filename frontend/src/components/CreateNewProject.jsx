
import { useDispatch } from 'react-redux'
import { uiActions } from '../Store/ui-slice'

import noProjectImg from '../assets/no-projects.png'
import { useNavigate } from 'react-router-dom'


export default function CreateNewProject() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleClick() {
        dispatch(uiActions.AddProjectClick())
        navigate('createNewProject')
    }


    return (
        <>
            {/* <div className='  flex justify-center items-center md:ml-[25%] w-full md:w-[75%] p-2 bg-[rgb(250,250,250)] ' > */}
            <div className=' flex justify-center items-center h-[calc(100%-75px)] ' >
                <div className=' flex flex-col items-center   '>
                    <img
                        className=' h-[180px] w-[180px] mb-2'
                        src={noProjectImg} alt="" />
                    <h2 className=' mb-0 text-2xl font-bold'>No Project Selected</h2>
                    <p className=' mb-5 '>Select a project or start with new one</p>
                    <button
                        onClick={handleClick}
                        className='cursor-pointer px-4 py-2 rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 shadow-sm'
                    >
                        Create new project
                    </button>

                </div>
            </div>
        </>
    )
}


