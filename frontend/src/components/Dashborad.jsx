import { Outlet, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';

import avatarImg from '../assets/avatar.png'
import closeSVG from '../assets/cancel.svg'
// import EditProfile from './editProfile'
import menuSVG from '../assets/menu.svg'

import { fetchUserProfile, fetchUserAvatar } from '../utils/http';
import { uiActions } from '../Store/ui-slice'
// import MainTasks from './MainTasks'
// import Profile from './profile'
import Projects from './Projects'
import CreateNewProject from './CreateNewProject'
// import EnterNewProject from './EnterNewProject'
// import EditTask from './UI/EditTask';
// import EditProject from './UI/EditProject';
// import DeleteTP from './UI/DeleteTP';
// import DeleteUserPop from './DeleteUserPop';
// import LogOutPop from './LogOutPop';


export default function Dashboard() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation();
    const { projectId } = useParams();

    const token = useLoaderData()
    // console.log(token)

    // const noProjectSelectedHere = !projectId;
    // const noProjectSelectedHere = location.pathname === '/dashboard' ;
    const noProjectSelectedHere = location.pathname === '/dashboard' || location.pathname === '/dashboard/';


    useEffect(() => {
        if (token) {
            dispatch(uiActions.storeToken(token));
        }
    }, [token, dispatch]);

    // Menu Toggle 

    function showMenuHandler() {
        dispatch(uiActions.toggleMenu())
    }

    const menuIsVisible = useSelector(state => state.ui.menuIsVisible)

    function hideMenu() {
        dispatch(uiActions.toggleMenu())
    }



    //  Profile

    function handleProfileOpen() {
        // dispatch(uiActions.profileClick())
        navigate('profile')
    }

    // function handleProfileClose() {
    //     // setShowProfileModal(false)
    //     navigate('..')
    // }

    // Show Profile Edit Model 

    // const showEditProfileModal = useSelector(state => state.ui.showEditProfileModal)
   

    // function handleEditProfileClose() {
    //     dispatch(uiActions.toggleEditProfile(false))

    // }


    // Project toggle 

    // const isProjectSeleted = useSelector(state => state.ui.isProjectSeleted)
    // const isAddProjectClick = useSelector(state => state.ui.isAddProjectClick)
    // const noProjectSeleted = useSelector(state => state.ui.noProjectSeleted)

    // Delete ModalC

    // const deleteFor = useSelector(state => state.ui.deleteFor)

    // Delete Account 

    // const deleteAccountClick = useSelector(state => state.ui.deleteAccountClick)

    function deleteAccountHandle() {
        // dispatch(uiActions.deleteAccount(true))
        console.log('delete account click')
        navigate('deleteacc')
    }

    // Logout 

    function logoutHandle() {
        console.log('logout Click')
        navigate('logout')
    }

    // Data fetching & http requests 

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['profileData'],
        queryFn: ({ signal }) => fetchUserProfile({ signal, token: token }),
        enabled: !!token,
    });

    const userId = data?._id || null;


    const { data: avatarUrl, isPending: avtIsPending, isError: isAvtErr, error: avtErr } = useQuery({
        queryKey: ['userAvatar', userId],
        queryFn: ({ signal }) => fetchUserAvatar({ userId, signal }),
        enabled: Boolean(userId),
        staleTime: 1000 * 60 * 60 * 2, // 2 hour
    });

    const profileSrc = (avtIsPending || isAvtErr || avtErr?.code === 404)
        ? avatarImg
        : avatarUrl;

    if (isError) {
        console.log(error.message)
        console.log(error.code)

        if (error.code == 401) {
            navigate('/login')
        }
    }

    return (
        <>
            {/* {isError && (
                <div>
                    <h1>error occure {error.message}</h1>
                </div>
            )} */}
            {/* {(deleteFor === 'Project' || deleteFor === 'Task') && (
                <DeleteTP title={deleteFor === 'Project' ? 'Project' : 'Task'} />
            )} */}

            {/* <LogOutPop /> */}

            {/* {deleteAccountClick && <DeleteUserPop />} */}

            {/* <EditTask /> */}
            {/* <EditProject /> */}

            {/* <Profile /> */}
            {/* <EditProfile /> */}

            {/* {showProfileModal && (
                <Profile onClose={handleProfileClose} />
            )} */}

            {/* {showEditProfileModal && (
                <EditProfile onClose={handleEditProfileClose} />
            )} */}

            <div className="h-screen w-full bg-gradient-to-br from-indigo-400 to-purple-600 flex">
                {/* sidebar */}
                <div className={`${!menuIsVisible ? 'left-[-655px]' : ' '} h-full w-[85%] md:w-[25%] bg-[rgb(244,244,244)] z-[1000] md:z-[0] absolute transition-all duration-100 ease-in  md:left-0 top-0`}> {/*left-[-655px]}
                <div className={`${!menuIsVisible && ' left-[-655px] '  } h-full w-[85%] md:w-[25%] bg-[rgb(244,244,244)] z-[1000] md:z-[0] absolute transition-all duration-100 ease-in  md:left-0`}> {/*left-[-655px]}
                                {/* avatar  */}
                    <div className=' border-0 h-[9%] w-[100%]  flex justify-between items-center p-4 border-b-[1px] border-gray-400'>
                        <div className='flex items-center gap-5'>

                            <img
                                onClick={() => { navigate('avatar') }}
                                className=' cursor-pointer h-[50px] w-[50px] rounded-[50px]'
                                src={profileSrc}
                                alt="Profile"
                            />

                            <button
                                onClick={handleProfileOpen}
                                className=' cursor-pointer w-[225px] md:w-[190px]'
                            >
                                <h2 className=' truncate text-xl font-semibold text-left '>{isPending ? 'Loading...' : data?.name}</h2>
                            </button>
                        </div>
                        <button onClick={hideMenu} className='block md:hidden cursor-pointer' >
                            <img src={closeSVG} alt="menu" />
                        </button>
                    </div>


                    <Projects token={token} />


                    {/* Log Out  */}
                    <div className=' absolute bottom-6 ml-4 flex gap-2 justify-between w-[92%] '>
                        <button
                            onClick={logoutHandle}
                            className=" w-full bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 active:bg-red-700"
                        >
                            Log Out
                        </button>
                        <button
                            onClick={deleteAccountHandle}
                            className=' w-full bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 active:bg-red-700'
                        >
                            Delete Account
                        </button>
                    </div>



                </div>

                {/* <MainTasks /> */}
                {/* {!isProjectSeleted ?  <CreateNewProject /> : undefined} */}
                {/* <EnterNewProject /> */}




                <div className='md:ml-[25%] w-full md:w-[75%] p-2 bg-[rgb(250,250,250)] ' >
                    {/* menu-SVG  */}
                    <div className='block md:hidden p-4 '>
                        <button onClick={showMenuHandler}> <img className='h-8 w-8 cursor-pointer ' src={menuSVG} alt="" /></button>
                    </div>



                    {noProjectSelectedHere ? <CreateNewProject /> : undefined}
                    {/* {isAddProjectClick ? <EnterNewProject /> : undefined} */}
                    {/* {isProjectSeleted ? <MainTasks /> : undefined} */}
                    <main>
                        <Outlet />
                    </main>

                </div>

            </div >



        </>
    )
}

