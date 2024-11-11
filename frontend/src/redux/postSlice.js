import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name:'post',
    initialState:{
        posts:[],
        selectedPost:null,
        userProfile:null,
    },
    reducers:{
        //action
        setPosts:(state,action)=>{
            state.posts=action.payload;
        },
        setSelectedPost:(state,action) => {
            state.selectedPost = action.payload;
        },
        setUserProfile:(state, action)=>{
            state.userProfile = action.payload;
        }
    }
});
export const {setPosts,setSelectedPost} = postSlice.actions;
export default postSlice.reducer;