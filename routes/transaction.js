import express from "express";
import jwt from 'jsonwebtoken'

import User from "../models/user.js";
import Transaction  from "../models/transaction.js";
import Auth from './userAuth.js'

const router = express.Router()

//Add Allocation
router.post("/add-Allocation", Auth, async (req, res) => {
    try {
        const existEmail = await User.findOne({email: req.headers.email})
        console.log(existEmail.id, req.body.bookName, existEmail.email, req.body.transactionType, req.body.fromDate, req.body.dueDate)
        if (!existEmail) return res.status(400).json({ msg: "Invalid Email" })
        else new Transaction({
            borrowerId: existEmail.id,
            bookName: req.body.bookName,
            bookImage: req.body.bookImage,
            borrowerEmail: existEmail.email,
            transactionType: req.body.transactionType,
            fromDate: req.body.fromDate,
            dueDate: req.body.dueDate
        }).save()
        res.status(200).json({ msg: "Allocation Succesfully" })
        
    }
    catch (err) {
        console.log("not enter")
        res.status(504).json(err)
    }
})

//All Allocation
router.get("/all-allocation", Auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({transactionStatus: "Active"}).sort({ _id: -1 })
        res.status(200).json({ msg: "Retreave All Allocations", transactions })
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

//Update Allocation
router.put("/update-allocation", Auth, async (req, res) => {
    try {
        await Transaction.findByIdAndUpdate(req.body.id, {toDate: req.body.toDate, transactionStatus: req.body.transactionStatus, transactionType: req.body.transactionType})
        res.status(200).json({ msg: "Allocation Updated Succesfully" })
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

//Find Active Allocations
router.get("/find-active-allocation", async (req, res) => {
    try {
        const transections = await Transaction.find({ borrowerEmail: req.headers.email })
        res.status(200).json({ msg: "Allocation Updated Succesfully", email: req.headers.email, transections })
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

export default router