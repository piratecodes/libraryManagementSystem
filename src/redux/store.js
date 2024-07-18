import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from './features/userSlice'


export const store = configureStore({
        reducer: combineReducers({
            user: userReducer,
        }),
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })



