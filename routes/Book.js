import express from "express";
import jwt from 'jsonwebtoken'

import User from "../models/user.js";
import Book from "../models/books.js"
import Auth from './userAuth.js'

const router = express.Router()

//Add new books to the system.
router.post("/addBook", Auth, async (req, res) =>{
    try{
        const user = await User.findOne({email: req.headers.email})
        if (user.isAdmin !== true)  return res.status(400).json({ msg: "You are not authorised" })
        await new Book({
            bookName: req.body.bookName, bookImage: req.body.bookImage, author: req.body.author, bookStatus: req.body.bookStatus, transactions: req.body.transactions
        }).save()
        return res.status(200).json({ msg: "Book Added Succesfully" })

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})


//Delete book from the system.
router.delete("/deleteBook", Auth, async (req, res) =>{
    try{
        const user = await User.findOne({email: req.headers.email})
        if (user.isAdmin !== true)  return res.status(400).json({ msg: "You are not authorised" })
        await Book.findByIdAndDelete(req.headers.bookid)
        return res.status(200).json({ msg: "Book delete Succesfully" })

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})

//Get All Books
router.get("/getBook",  async (req, res) =>{
    try{
        return res.status(200).json({ books: await Book.find().sort({ createdAt: -1 }) })

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})

//Get Recent Books
router.get("/getRecentBook",  async (req, res) =>{
    try{
        return res.status(200).json({ books: await Book.find().sort({ createdAt: -1 }).limit(4) })
    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})

//Change Book Availability
router.put("/bookAvailability", Auth, async (req, res) =>{
    try{
        const bookId = req.headers.bookid
        await Book.findByIdAndUpdate(bookId, {
            bookStatus: req.body.bookStatus
        })
        return res.status(200).json({ books: await Book.find().sort({ createdAt: -1 }).limit(4) })
    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})

export default router