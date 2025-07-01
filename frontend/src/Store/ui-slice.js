
import { createSlice, current } from '@reduxjs/toolkit'

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        menuIsVisible: false,
        // showEditProfileModal: false,

        // noProjectSeleted: true,
        // isProjectSeleted: false,
        isAddProjectClick: false,

        isEditProjectClick: false,
        isEditTaskClick: false,

        // deleteFor: '',

        // deleteAccountClick: false,

        token: '',

        currentProjectName: null
    },
    reducers: {
        toggleMenu(state) {
            state.menuIsVisible = !state.menuIsVisible
        },
        // profileClick(state){
        //     state.isProfileClick = true
        // },
        // profileClose(state){
        //     state.isProfileClick = false
        // },
        // toggleEditProfile(state, action) {
        //     state.showEditProfileModal = action.payload
        // },
        addIconProject(state) {
            state.noProjectSeleted = true
            // state.isProjectSeleted = false
            state.isAddProjectClick = false
        },
        AddProjectClick(state, action) {
            state.isAddProjectClick = true
            state.noProjectSeleted = false
        },
        EnterProjectCancelButton(state, action) {
            state.isAddProjectClick = false
            state.noProjectSeleted = true
        },
        // handleProjectClick(state) {
        //     state.isProjectSeleted = true
        //     state.isAddProjectClick = false
        //     state.noProjectSeleted = false
        // },


        // EditTaskClick(state){
        //     state.isEditTaskClick = true
        // },
        // EditTaskClickCalcel(state){
        //     state.isEditTaskClick = false
        // },


        // editProjectClick(state){
        //     state.isEditProjectClick = true 
        // },
        // editProjectClickCancel(state){
        //     state.isEditProjectClick = false
        // },


        // deleteFor(state, action){
        //     state.deleteFor = action.payload
        // },


        // deleteAccount(state, action){
        //     state.deleteAccountClick = action.payload
        // },


        storeToken(state,action){
            state.token = action.payload
        },


        setProjectName(state, action){
            state.currentProjectName = action.payload
        }
    }
})

export const uiActions = uiSlice.actions

export default uiSlice


