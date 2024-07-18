"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
//redux
import {useDispatch, useSelector as Selector} from 'react-redux'
import { userSlice } from '@/redux/features/userSlice'

function Profile(){
  //Redux
  const { email, name,  avtar, mobile, address, jwt } = Selector((state) => state.user)


  const categories = [
    {
      name: 'Add/ Remove Book',
    },
    {
      name: 'Issue / return books',
    },
    {
      name: 'Altering Availability',
    },
    {
      name: 'Add New User',
    },
  ]

  const dispatch = useDispatch()
  const router = useRouter();

  //JWT find & Fetch Data
  useEffect(()=>{
    if(!localStorage.getItem("jwt_token")) router.push('/')
    fetchdata()
    transBook()
  })

  const logout = () => {
    localStorage.removeItem('jwt_token');
    dispatch(userSlice.actions.clearState());
    router.push("/")
  }

  //books data
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(false)
    const fetchdata = async ()=>{
      try {
          const response = await fetch('http://localhost:1000/api/books/getBook');
          const result = await response.json();
          setAllBooks(result);
          // console.log(allBooks.books)
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally { setLoading(true) }
    }
    const deleteBook = async (id)=>{
        try{
          await fetch( 'http://localhost:1000/api/books/deleteBook',
            {
              method: 'DELETE',
              headers: {
                  Accept: 'application/json',
                  email: email,
                  bookid: id,
                  authorization: `Bearer ${jwt}`,
                  'Content-Type': 'application/json',
              },
            }
          )
          alert("Book Deleted Successfully")
        } catch (e){
          console.log(e)
        }
    }
    
    //add Book
    const [bookName, setBookName] = useState("")
    const [bookImage, setBookImage] = useState("")
    const [BookAuthor, setBookAuthor] = useState("")
    const [bookAvailable, setBookAvailable] = useState("Available")
    const addBook = async (event)=>{
      event.preventDefault();
      console.log(email, jwt, bookName, bookImage, BookAuthor, bookAvailable)
      try{
        await fetch( 'http://localhost:1000/api/books/addBook',
          {
            method: 'POST',
            headers: {
                email: email,
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }, body: `{
              "bookName": "${bookName}", 
              "bookImage": "${bookImage}", 
              "author": "${BookAuthor}",
              "bookStatus": "${bookAvailable}"
            }`
          }
        )
        alert("Book Added Successfully")
      } catch (e){
        console.log(e)
      }
    }

    //Book Availability Change
    const changeBookAvailable = async (id, status)=>{
      try{
        await fetch( 'http://localhost:1000/api/books/bookAvailability',
          {
            method: 'PUT',
            headers: {
                bookid: id,
                authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            }, body: `{
              "bookStatus": "${status == "Available" ? "Not Available" : "Available"}"
            }`
          }
        )
        alert("Book Alter Succesfully")
      } catch (e){
        console.log(e)
      }
    }

    //User Sign In
    const [userName, setUserName] = useState("")
    const [userAddress, setUserAddress] = useState("")
    const [userMobile, setUserMobile] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [userPassword2, setUserPassword2] = useState("")
    const [selectedGender, setSelectedGender] = useState('Male')
    const [isAdmin, setIsAdmin] = useState(false)
    
    const addAccount = async (event)=>{
      event.preventDefault();
      if( userPassword !== userPassword2){ alert("Password Mismatch "); return}
      try{
        await fetch( 'http://localhost:1000/api/users/signup',
          {
            method: 'POST',
            headers: {
              Accept: '*/*',
              'Content-Type': 'application/json'
            }, body: `{
              "userType": "${isAdmin? "Admin" : "User"}", 
              "userFullName": "${userName}", 
              "gender": "${selectedGender}", 
              "address": "${userAddress}", 
              "mobileNumber": "${userMobile}", 
              "email": "${userEmail}", 
              "password": "${userPassword}",
              "isAdmin": ${isAdmin}
            }`
          }
        )
        alert("Account Created Successfully")
      } catch (e){
        console.log(e)
      } finally{ setUserName(""), setUserAddress(""), setUserMobile(""), setUserEmail(""), setUserPassword(""), setUserPassword2("")   }
    }

    //User Issued Book
    const [showPanel, setShowPanel] = useState(false)
    const [issueBookData, setIssueBookData] = useState({})
    const [issueEmail, setIssueEmail] = useState("")
    const [issueDate, setIssueDate] = useState("")
    const [issueDueDate, setIssueDueDate] = useState("")
    const dateInputRef = useRef(null);
    const dateInputRef2 = useRef(null);
    const issueBook = async () =>{
      console.log(issueBookData, issueEmail, issueDate, issueDueDate, jwt)
      setShowPanel(false)
      try{
        await fetch( 'http://localhost:1000/api/transaction/add-Allocation',
          {
            method: 'POST',
            headers: {
              email: issueEmail,
              authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }, body: `{
              "borrowerId": "${issueBookData._id}",
              "bookName": "${issueBookData.bookName}",
              "bookImage": "${issueBookData.bookImage}",
              "transactionType": "Borrowed",
              "fromDate": "${issueDate}",
              "dueDate": "${issueDueDate}"
            }`
          }
        )
        alert("Book Issued to the user")
      } catch (e){
        console.log(e)
      }
    }

    //Show all Transection
    const [allTransection, setAllTransection] = useState(null)
    const [loadingTrans, setLoadingTrans] = useState(false)
    const transBook = async () =>{
      try{
        const res = await fetch( 'http://localhost:1000/api/transaction/all-allocation', {
          method: 'GET',
          headers: {
            authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          }
        }
        )
        const data = await res.json()
        setAllTransection(data)
        setLoadingTrans(true)
      } catch (e){
        console.log(e)
      }
    }

    //Return a book
    const [showPanel2, setShowPanel2] = useState(false)
    const [transBookData, setTransBookData] = useState()
    const [returnDate, setReturnDate] = useState('')
    const dateInputRef3 = useRef(null);
    const returnBook = async ()=>{
      setShowPanel2(false)
      try{
        const res = await fetch( 'http://localhost:1000/api/transaction/update-allocation',{
          method: 'PUT',
          headers: {
            authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
          },
          body: `{ "id":"${transBookData._id}", "toDate":"${returnDate}", "transactionType":"Returned", "transactionStatus":"Deactive" }`
        })  
      } catch (e){
        console.log(e)
      }
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
                    <Image src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png" alt="Bonnie Avatar" height="0" width="0" sizes="100vw" className="shadow-xl rounded-full h-auto w-36 align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"/>
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
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div className="flex h-auto w-full justify-center py-8 px-4">
                  <TabGroup className="w-full ">
                    <TabList className="flex gap-4 justify-center">
                      {categories.map(({ name }) => (
                        <Tab
                          key={name}
                          className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                        >
                          {name}
                        </Tab>
                      ))}
                    </TabList>
                    <TabPanels className="mt-3">
                      {/* Add or remove book  */}
                      <TabPanel>
                      <form onSubmit={addBook} className="max-w-2xl mx-auto">
                          <h3 className="text-lg font-semibold leading-normal my-2 text-blueGray-700 mb-2">Add a New Book</h3>
                          <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input type="name" name="floating_bookName" id="floating_bookName" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={e => setBookName(e.target.value)} value={bookName} required />
                                <label htmlFor="floating_bookName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Book Name</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input type="name" name="floating_author" id="floating_author" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={e => setBookAuthor(e.target.value)} value={BookAuthor} required />
                                <label htmlFor="floating_author" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Author</label>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="flex space-x-8 align-center">
                              <p> Book Status:  </p>
                              <div className="flex items-center">
                                  <input id="default-radio-3" type="radio" value="Available" name="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e)=> setBookAvailable(e.target.value) } checked={bookAvailable === 'Available'} />
                                  <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Available</label>
                              </div>
                              <div className="flex items-center">
                                  <input id="default-radio-4" type="radio" value="Not Available" name="radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e)=> setBookAvailable(e.target.value) } checked={bookAvailable === 'Not Available'} />
                                  <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Not Available</label>
                              </div>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                            <input type="url" name="floating_url" id="floating_url" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={e => setBookImage(e.target.value)} value={bookImage} required />
                            <label htmlFor="floating_url" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Image url</label>
                            </div>
                          </div>
                          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                        </form>
                        
                        <section className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                            <h3 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">All Books</h3>
                            
                            {
                                loading && <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                                    {
                                        allBooks && allBooks.books.map((i, n)=>{
                                            return <div className="relative items-center bg-gray-500/50 rounded-lg shadow sm:flex" key={n}>
                                                <Image className="w-auto h-56 rounded-lg sm:rounded-none sm:rounded-l-lg" src={i.bookImage} alt="Bonnie Avatar" height="0" width="0" sizes="100vw" />
                                                <div className="p-5">
                                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"> {i.bookName}</h3>
                                                    <p className="text-gray-500 dark:text-gray-400">{i.author}</p>
                                                </div>
                                                <button type="button" className="absolute right-5 bottom-5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={()=>deleteBook(i._id)}>Delete Book</button>
                                            </div>
                                        })
                                    }
                                </div> 
                            } 
                            
                        </section>

                      
                      </TabPanel>

                      {/* Issue / Return Book */}
                      <TabPanel className="rounded-xl bg-white/5 p-3">

                          <TabGroup>
                              <TabList className="flex gap-4 justify-center">
                                  <Tab  className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                    Issue a Book
                                  </Tab>
                                  <Tab  className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                    Return a Book
                                  </Tab>
                              </TabList>
                              <TabPanels className="mt-3">
                                  
                                  {/* Issue A BOOK */}
                                  <TabPanel className="rounded-xl p-3">
                                    {
                                        loading && <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                                            {
                                                allBooks && allBooks.books.map((i, n)=>{
                                                    return <div className="relative items-center bg-gray-500/50 rounded-lg shadow sm:flex" key={n}>
                                                        <Image className="w-auto h-56 rounded-lg sm:rounded-none sm:rounded-l-lg" src={i.bookImage} alt="Bonnie Avatar" height="0" width="0" sizes="100vw" />
                                                        <div className="pl-5">
                                                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"> {i.bookName}</h3>
                                                            <p className="text-gray-500 dark:text-gray-400">{i.author}</p>
                                                            <button type="button" className="absolute right-1.5 bottom-1.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(e)=>{e.preventDefault(); setIssueBookData(i); setShowPanel(true)}}>Set Borrowed</button>
                                                        </div>  
                                                    </div>
                                                })
                                            }
                                        </div>
                                    }
                                  </TabPanel>
                                  { showPanel && <form className="fixed inset-0 bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center">
                                    <div className="mx-auto max-w-lg relative flex-col z-0 w-full mb-5 group">
                                      <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setIssueEmail(e.target.value) } value={issueEmail} required />
                                      <label htmlFor="floating_email" className="mb-10 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                                      <label htmlFor="issue-date" >Issue Date</label>
                                      <input type="date" id="issue-date" name="issueDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Issue Date" ref={dateInputRef} onChange={(e) => setIssueDate(e.target.value)} />
                                      <label htmlFor="sue-date" >Due Date</label>
                                      <input type="date" id="due-date" name="dueDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Due Date" ref={dateInputRef2} onChange={(e) => setIssueDueDate(e.target.value)} />
                                      <button type="button" className="mt-10 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(e)=>{e.preventDefault(); issueBook()}}>Set Borrowed</button>
                                    </div>
                                  </form> } 
                                  
                                  {/* Return A BOOK */}
                                  <TabPanel className="rounded-xl p-3">
                                    {
                                          loadingTrans && <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                                              {
                                                  allTransection.transactions && allTransection.transactions.map((i, n)=>{
                                                      return <div className="relative items-center bg-gray-500/50 rounded-lg shadow sm:flex" key={n}>
                                                          <Image className="w-auto h-56 rounded-lg sm:rounded-none sm:rounded-l-lg" src={i.bookImage} alt="Bonnie Avatar" height="0" width="0" sizes="100vw" />
                                                          <div className="pl-5">
                                                              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"> {i.bookName}</h3>
                                                              <p className="text-gray-500 dark:text-gray-400">Borrower: {i.borrowerEmail}</p>
                                                              <p className="text-gray-500 dark:text-gray-400">Due Date: {i.dueDate}</p>
                                                              <button type="button" className="absolute right-1.5 bottom-1.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(e)=>{e.preventDefault(); setTransBookData(i); setShowPanel2(true)}}>Set Return</button>
                                                          </div>  
                                                      </div>
                                                  })
                                              }
                                          </div>
                                      }
                                  </TabPanel>

                                    { showPanel2 && <form className="fixed inset-0 bg-black bg-opacity-50 w-screen h-screen flex items-center justify-center">
                                      <div className="mx-auto max-w-lg relative flex-col z-0 w-full mb-5 group">
                                        <label htmlFor="issue-date" >Return Date</label>
                                        <input type="date" id="issue-date" name="issueDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Issue Date" ref={dateInputRef3} onChange={(e) => setReturnDate(e.target.value)} />
                                        <button type="button" className="mt-10 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={(e)=>{e.preventDefault(); returnBook()}}>Confirm Return</button>
                                      </div>
                                    </form> }
                              </TabPanels>
                            </TabGroup>

                      </TabPanel>

                      {/* Change Book Available */}
                      <TabPanel>
                        
                        <section className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
                            <h3 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Alter Avavility</h3>
                            
                            {
                                loading && <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
                                    {
                                        allBooks && allBooks.books.map((i, n)=>{
                                            return <div className="relative items-center bg-gray-500/50 rounded-lg shadow sm:flex" key={n}>
                                                <Image className="w-auto h-56 rounded-lg sm:rounded-none sm:rounded-l-lg" src={i.bookImage} alt="Bonnie Avatar" height="0" width="0" sizes="100vw" />
                                                <div className="p-5">
                                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"> {i.bookName}</h3>
                                                    <p className="text-gray-500 dark:text-gray-400">{i.author}</p>
                                                    <p className="text-gray-500 dark:text-gray-400">Book Status: {i.bookStatus}</p>
                                                </div>
                                                <button type="button" className={`absolute right-5 bottom-5 focus:outline-none text-white ${i.bookStatus == "Available" ? "bg-red-700" : "bg-green-600"} hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2`} onClick={()=> changeBookAvailable(i._id, i.bookStatus)}>{i.bookStatus == "Available"? "Make Unavailable" : "Make Available"}</button>
                                            </div>
                                        })
                                    }
                                </div> 
                            } 
                            
                        </section>
                      
                      </TabPanel>

                      {/* Add user */}
                      <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                        

                        <form onSubmit={addAccount} className="max-w-2xl mx-auto">
                          <div className="relative z-0 w-full mb-5 group">
                              <input type="name" name="floating_name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setUserName(e.target.value) } value={userName} required />
                              <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                              <input type="email" name="floating_email" id="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setUserEmail(e.target.value) } value={userEmail} required />
                              <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                              <input type="password" name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setUserPassword(e.target.value) } value={userPassword} required />
                              <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                          </div>
                          <div className="relative z-0 w-full mb-5 group">
                              <input type="password" name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setUserPassword2(e.target.value) } value={userPassword2} required />
                              <label htmlFor="floating_repeat_password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="flex space-x-8 align-center">
                              <div className="flex items-center">
                                  <input id="default-radio-1" type="radio" value="Male" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e)=> setSelectedGender(e.target.value) } checked={selectedGender === 'Male'} />
                                  <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                              </div>
                              <div className="flex items-center">
                                  <input id="default-radio-2" type="radio" value="Female" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e)=> setSelectedGender(e.target.value) } checked={selectedGender === 'Female'} />
                                  <label htmlFor="default-radio-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                              </div>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                              <input id="check_admin" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={isAdmin} onChange={(e)=> setIsAdmin(e.target.checked)}   />
                              <label htmlFor="check_admin" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Admin</label>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input type="tel" name="floating_phone" id="floating_phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setUserMobile(e.target.value) } value={userMobile} required />
                                <label htmlFor="floating_phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone number</label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input type="" name="floating_address" id="floating_address" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={ e => setUserAddress(e.target.value) } value={userAddress} required />
                                <label htmlFor="floating_address" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Address</label>
                            </div>
                          </div>
                          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign In</button>
                        </form>

                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
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