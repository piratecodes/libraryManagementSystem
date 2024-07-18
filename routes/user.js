import express from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from "../models/user.js";
import Auth from './userAuth.js'

const router = express.Router()

//signup
router.post("/signup", async (req, res) =>{
    try{
        const { userType, userFullName, gender, address, mobileNumber, email, password, isAdmin } = req.body
        //checking email is already exist or not
        const existEmail = await User.findOne({email: email})
        if (existEmail) return res.status(400).json({ msg: "Email Already Exist" })
        
        //check password length
        else if(password.length < 8) return res.status(400).json({ msg: "password length is short" })
        
        // add new user
        else await new User({
            userType: userType, userFullName: userFullName, gender: gender, address: address, mobileNumber: mobileNumber, email: email, password: await bcrypt.hash(password, 15), isAdmin: isAdmin
        }).save()
        return res.status(200).json({ msg: "Signup Successfully" })

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})


//signIn
router.post("/signin", async (req, res) =>{
    try{
        const { email, password } = req.body
        
        //checking email is already exist or not
        const userData = await User.findOne({ email })
        if (!userData) return res.status(400).json({ msg: "Invalid Crediantial" })
        
        bcrypt.compare(password, userData.password, (err, data) => {
            if (data) return res.status(200).json({ msg:"Signup successfull", user:{name: userData.userFullName, gender: userData.gender, address: userData.address, mobile: userData.mobileNumber, photo: userData.photo, email: userData.email, activeTrans: userData.activeTransactions, prevTrans: userData.prevTransactions, isAdmin: userData.isAdmin }, token: jwt.sign({userData}, "JwTKeY", { expiresIn: "30d" }) })
            else return res.status(400).json({ message: "Invalid Crediantial" })
        })

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})

//Get user Info
router.post("/getUserInfo", Auth, async (req, res) =>{
    try{
        const user = await User.findById(req.headers.id).select('-password')
        return res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})

//signIn2
router.get("/getUserInfo2", Auth, async (req, res) =>{
    try{
        const user = jwt.verify(req.headers.authorization.split(' ')[1], "JwTKeY")
        return res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ msg:"Internal Server error" })
    }
})


export default router