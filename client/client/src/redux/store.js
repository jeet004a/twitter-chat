import { configureStore } from '@reduxjs/toolkit'
import loaderReducer from './loderSlicer'
import userReducer from './userSlicer'
// import userReducer

const store = configureStore({
    reducer: { loaderReducer, userReducer }
})

export default store