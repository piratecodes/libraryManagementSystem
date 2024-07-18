'use client'
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from "next/image";

function Recent(){
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(false)
    const fetchdata = async ()=>{
        try {
            const response = await fetch('http://localhost:1000/api/books/getRecentBook');
            const result = await response.json();
            setAllBooks(result.books);
            console.log(allBooks.books)
            setLoading(true)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    }
    // fetchdata();
    useEffect( ()=>{
        fetchdata()
    })

    return(
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Recent Books</h2>
                    <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">Books can be trusted to keep your secrets and listen to your thoughts. This slogan portrays books as silent companions that provide solace and a listening ear.</p>
                </div> 
                
                {
                    loading && <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                        {
                            allBooks && allBooks.map((i, n)=>{
                                return <div className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700" key={n}>
                                    <Image className="w-auto h-56 rounded-lg sm:rounded-none sm:rounded-l-lg" src={i.bookImage} alt="Bonnie Avatar" height="0" width="0" sizes="100vw" />
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"> {i.bookName}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">{i.author}</p>
                                    </div>
                                </div>
                            })
                        }
                    </div> 
                } 
                 
            </div>
        </section>
    )
}

export default Recent