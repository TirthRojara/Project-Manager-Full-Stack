import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom'

import { PROJECT_DATA } from '../assets/data'
import addSVG from '../assets/add.svg'
import Project from './UI/Project'
import { uiActions } from '../Store/ui-slice'
import { fetchAllProject } from '../utils/http';


export default function Projects({ token }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { projectId } = useParams();

    // const token = useSelector(state => state.ui.token)

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['projectAll'],
        queryFn: ({ signal }) => fetchAllProject({ signal, token: token }),
        enabled: !!token,
    });

    // const currentProject = allProjects.find(p => p._id === projectId);
    // console.log(allProjects)


    if (isError) {
        console.log(error.message)
        console.log(error.code)

        if (error.code == 401) {
            navigate('/login')
        }
    }


    function handleAddiconProject() {
        dispatch(uiActions.addIconProject())
        console.log('add icon click')
        // navigate('/dashboard')
        navigate('createNewProject')
    }

    return (
        <>
            {/* Projects  */}
            <div className='border-0 h-[75%] mt-4 p-4   '>
                <div className=' border-0 border-red-400 flex items-center justify-between mb-4 pr-3'>
                    <h2 className='text-2xl font-semibold '>Projects</h2>
                    <button
                        onClick={handleAddiconProject}
                        className=' cursor-pointer transition-transform duration-100 hover:scale-115 '
                    >
                        <img src={addSVG} alt="" />
                    </button>
                </div>
                <div className="  border-0 h-[90%] overflow-y-scroll  [&::-webkit-scrollbar]:hidden   [-ms-overflow-style:none]   [scrollbar-width:none]  md:[scrollbar-width:auto]  md:[-ms-overflow-style:auto]  md:[&::-webkit-scrollbar]:block   md:[&::-webkit-scrollbar]:w-2  md:[&::-webkit-scrollbar-thumb]:bg-gray-400  md:[&::-webkit-scrollbar-thumb]:rounded-full ">
                    <ul className='space-y-0.5'>

                        {isPending && (
                            <p>Loading...</p>
                        )}

                        {!isPending && (
                            data.map((project) => (
                                <li key={project._id}>
                                    <Project title={project.projectName} id={project._id} />
                                </li>
                            ))
                        )}

                        {/* {PROJECT_DATA.map((project) => (
                            <li key={project._id}>
                                <Project title={project.projectName} />
                            </li>
                        ))} */}

                    </ul>
                </div>
            </div>
        </>
    )
}