"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useSelector, useDispatch } from 'react-redux';
import { loginUser, userSelector, clearState } from '@/redux/features/userSlice'

function UserLogin(){
    //Redux
    const Dispatch = useDispatch();
    const { isSuccess, isError, errorMessage } = useSelector( userSelector );
    const router = useRouter()
    const [userData, setUserData] = useState({
        userEmail: "", userPassword: "", isChecked: false
    })

    const onSubmit = (e) => {
        e.preventDefault();
        Dispatch( loginUser({identifier: userData.userEmail, password: userData.userPassword}) )
    }

    React.useEffect(() => {
        if (isError) {
            alert(errorMessage);
            Dispatch(clearState());
        }

        if (isSuccess) {
            setTimeout(()=>{
                router.push('/')
            },100)
        }
    }, [isError, isSuccess, Dispatch, errorMessage, router]);

    return(
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">User Login Forum</h1>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h2>
                        <form onSubmit={ onSubmit } className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" onChange={e => setUserData(prevState => { return {...prevState, userEmail: e?.target?.value}} )} value={userData.userEmail} />
                            </div>
                            <div>
                                <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={ (e) => setUserData(prevState => { return {...prevState, userPassword: e.target.value}} ) } value={userData.userPassword} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label for="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UserLogin