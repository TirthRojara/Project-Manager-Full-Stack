import { useDispatch } from 'react-redux'

import { uiActions } from '../../Store/ui-slice'
import editSVG from '../../assets/edit.svg'
import deleteSVG from '../../assets/delete.svg'
import { useNavigate } from 'react-router-dom'

export default function Project({ title, id }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    
    


    function handleProjectClick() {
        // dispatch(uiActions.handleProjectClick())
        console.log(`click on project `, title)
        console.log(id)
        dispatch(uiActions.setProjectName(title))
        navigate(`project/${id}`)
       
    }


    // edit

    function handleEdit() {
         dispatch(uiActions.setProjectName(title))
        console.log('project edit click')
        // dispatch(uiActions.editProjectClick())
        navigate(`project/${id}/edit`)
       
    }

    // delete

    function handleDelete() {
        dispatch(uiActions.setProjectName(title))
        console.log('project delete click')
        // dispatch(uiActions.deleteFor('Project'))
        navigate(`project/${id}/delete`)
    }


    return (
        <>
            <div className='p-2 flex justify-between items-center gap-1 rounded-lg hover:bg-[rgb(230,230,230)]'>
                <div className='  text-xl w-[220px] truncate'>
                    <button
                        onClick={handleProjectClick}
                        className=' cursor-pointer w-full text-left'
                    >
                        <p className=' truncate'>{title} </p>
                    </button>
                </div>
                <div className='flex gap-5'>
                    <button
                        onClick={handleEdit}
                        className='min-w-[24px] min-h-[24px] cursor-pointer transition-transform duration-100 hover:scale-115 '
                    >
                        <img className='w-[21px] h-[21px]' src={editSVG} alt="" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className='min-w-[24px] min-h-[24px] cursor-pointer transition-transform duration-100 hover:scale-115 '
                    >
                        <img className='w-[21px] h-[21px]' src={deleteSVG} alt="" />
                    </button>
                </div>
            </div>
        </>
    )
}

