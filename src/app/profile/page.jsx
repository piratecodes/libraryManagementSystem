"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Link from "next/link";

//redux
import {useDispatch, useSelector as Selector} from 'react-redux'
import { userSlice } from '@/redux/features/userSlice'

function Profile(){
  const router = useRouter()
  //Redux
  const dispatch = useDispatch()
  const { email, name,  avtar, mobile, address } = Selector((state) => state.user)

  //Get All Transactions
  const [trans, setTrans] = useState('')
  const fetchdata = async ()=>{
    try {
        const response = await fetch('http://localhost:1000/api/transaction/find-active-allocation',{
            method: 'GET', headers: { email: `${email}` }
        });
        const result = await response.json();
        setTrans(result)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
}

  useEffect(()=>{
    if(!localStorage.getItem("jwt_token")) router.push('/')
    fetchdata()  
  })
  
  
  
  const logout = () => {
    localStorage.removeItem('jwt_token');
    dispatch(userSlice.actions.clearState());
    router.push("/")
  }

    return(
      <main className="bg-gray-50 dark:bg-gray-900">
        <section className="relative block h-[350px]">
        </section>
        <section className="relative py-16 bg-gray-600 text-white">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white/25 w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="relative flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                      <Image src={avtar} alt="Bonnie Avatar" height="0" width="0" sizes="100vw" className="shadow-xl rounded-full h-auto w-36 align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"/>
                  </div>
                  <button onClick={logout} className="absolute right-2 top-2 md:right-4 md:top-4 bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                    Logout
                  </button>
                </div>
                <div className="text-center mt-32">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                    {name}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                    {address}
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-10">
                    {email}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    {mobile}
                  </div>
                  <div className="mb-2 text-blueGray-600">
                    {avtar}
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <h4 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2"> Due Books </h4>
                  <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                    { trans.transections && trans.transections.map((i, m) => {
                      return i.length == 0? <p>No Due Book</p> : i.transactionStatus == "Active" && <div key={m} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Image className="h-auto w-48 mx-auto hidden dark:block" src={i.bookImage} alt="" height={0} width={0} sizes='100vw'/>
                        <div className="pt-6">
                          <p className="me-2 rounded bg-primary-100 px-2.5 py-1.5 text-xs font-medium text-slate-200 dark:bg-primary-900 dark:text-primary-300">{i.author}</p>
                          <Link href="#" className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">{i.bookName}</Link>
                        </div>
                        <p className="me-2 rounded bg-primary-100 py-1.5 text-sm font-medium text-slate-200 dark:bg-primary-900 dark:text-primary-300">Borrowed: {i.fromDate}</p>
                        <p className="me-2 rounded bg-primary-100 py-1.5 text-sm font-medium text-slate-200 dark:bg-primary-900 dark:text-primary-300">Due Date: {i.dueDate}</p>
                      </div>
                    }) }
                  </div>
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <h4 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2"> Previous Transection </h4>
                  <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
                    { trans.transections && trans.transections.map((i, m) => {
                      return i.length == 0? <p>No Previous Book</p> : i.transactionStatus == "Deactive" && <div key={m} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Image className="h-auto w-48 mx-auto hidden dark:block" src={i.bookImage} alt="" height={0} width={0} sizes='100vw'/>
                        <div className="pt-6">
                          <p className="me-2 rounded bg-primary-100 px-2.5 py-1.5 text-xs font-medium text-slate-200 dark:bg-primary-900 dark:text-primary-300">{i.author}</p>
                          <Link href="#" className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">{i.bookName}</Link>
                        </div>
                        <p className="me-2 rounded bg-primary-100 py-1.5 text-sm font-medium text-slate-200 dark:bg-primary-900 dark:text-primary-300">Borrowed: {i.fromDate}</p>
                        <p className="me-2 rounded bg-primary-100 py-1.5 text-sm font-medium text-slate-200 dark:bg-primary-900 dark:text-primary-300">Returned: {i.toDate}</p>
                      </div>
                    }) }
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    )
}

export default Profile