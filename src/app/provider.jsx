'use client'
import React from 'react'

// Redux
import { Provider } from 'react-redux';
import { store } from '@/redux/store'
export default function Providers({ children }) {

    return (
        <>
            <Provider store={store}>
                {children}
            </Provider>
        </>
    )
}
