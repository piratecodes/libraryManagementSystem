import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user.js";
import BookRoutes from './routes/Book.js'
import TransRoutes from './routes/transaction.js'

/* App Config */
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

/* Middlewares */
app.use(express.json());
app.use(cors({
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
 }));

/* API Routes */
app.get("/", (req, res)=>{
    res.send(`hello from backend3`);
})

/* MongoDB connection */
try {
    mongoose.connect( process.env.MONGO_URL ); 
    console.log("MONGODB CONNECTED")
} catch(error) {
    console.log(error)
}
  
app.use("/api/users", userRoutes);
app.use("/api/books", BookRoutes);
app.use("/api/transaction", TransRoutes);

app.listen(port, () => {
    console.log(`Server is running in PORT ${port}`);
  });