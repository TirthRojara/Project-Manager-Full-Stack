import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from "react";

import { queryClient, fetchAllProject, fetchUpdateProjectName } from "../../utils/http";
import { uiActions } from "../../Store/ui-slice";
// import Modal from "../../pages/Model";
import ModalLast from "./ModalLast";


export default function EditProject() {

    const preValue = 'Before Edit'

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { projectId } = useParams();

    const token = useSelector(state => state.ui.token)
    // const currentProjectName = useSelector(state => state.ui.currentProjectName)
    const [projectNameInput, setProjectNameInput] = useState('');



    const { data: allProjects, isPending, isError, error } = useQuery({
        queryKey: ['projectAll'],
        queryFn: ({ signal }) => fetchAllProject({ signal, token: token }),
        enabled: !!token,
    });

    const currentProject = allProjects?.find(p => p._id === projectId);

    useEffect(() => {
        if (currentProject?.projectName) {
            setProjectNameInput(currentProject.projectName);
        }
    }, [currentProject]);



    if (isError) {
        console.log(error.message)
        console.log(error.code)

        if (error.code == 401) {
            navigate('/login')
        }
    }


    const { mutate } = useMutation({
        mutationFn: fetchUpdateProjectName,

        onMutate: async ({ changeName, id }) => {

            await queryClient.cancelQueries({ queryKey: ['projectAll'] });
            const previousProjects = queryClient.getQueryData(['projectAll']) || [];

            const updatedProjects = previousProjects.map((project) =>
                project._id === id ? { ...project, ...changeName } : project
            );

            queryClient.setQueryData(['projectAll'], updatedProjects);

            return { previousProjects }
        },

        onError: (error, context) => {
            console.log('onError while update project name')
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

        onSuccess: () => {
            console.log('project name updated success')
        },

        onSettled: () => {
            queryClient.invalidateQueries(['projectAll']);
            navigate('..')
        }
    })




    function handleEdit(event) {
        event.preventDefault();
        console.log('Edit save change click')

        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries())
        console.log(data)

        mutate({
            changeName: {
                projectName: data.project
            },
            token,
            id: projectId
        })
    }


    const isEditProjectClick = useSelector(state => state.ui.isEditProjectClick)


    function handleEditClose() {
        console.log('Edit project close click')
        // dispatch(uiActions.editProjectClickCancel())
        navigate('..')
    }




    return (
        <>
            <ModalLast
            // open={isEditProjectClick}
            // onClose={handleEditClose}
            >
                <form onSubmit={handleEdit}>
                    <div>
                        <label htmlFor="profile-name" className="block mb-1 font-semibold">Project Title</label>
                        <input
                            type="text"
                            name="project"
                            // defaultValue={currentProject?.projectName || "Loading..."}
                            value={projectNameInput}
                            onChange={(e) => setProjectNameInput(e.target.value)}
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






