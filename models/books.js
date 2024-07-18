import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    bookName:{
        type:String,
        require:true
    },
    bookImage:{
        type:String,
        default:"https://dummyimage.com/300x450/0b5b2b/fff.png&text=preview"
    },
    author:{
        type:String,
        require:true
    },
    bookStatus:{
        type:String,
        default:"Available"
    },
    transactions:[{
        type:mongoose.Types.ObjectId,
        ref:"BookTransaction"
    }]
},
{
    timestamps:true
})

export default mongoose.model("Book",BookSchema)