import mongoose from "mongoose"

const BookTransactionSchema = new mongoose.Schema({
    borrowerId: { //EmployeeId or AdmissionId
        type: String,
        require: true
    },
    bookName: {
        type: String,
        require: true
    },
    bookImage:{
        type:String,
        default:"https://dummyimage.com/300x450/0b5b2b/fff.png&text=preview"
    },
    borrowerEmail: {
        type: String,
        require: true
    },
    transactionType: { // borrowed or returned
        type: String,
        require: true,
    },
    fromDate: {
        type: String,
        require: true,
    },
    toDate: {
        type: String,
    },
    dueDate: {
        type: String
    },
    transactionStatus: {
        type: String,
        default: "Active"
    }
},
    {
        timestamps: true
    }
);

export default mongoose.model("BookTransaction", BookTransactionSchema)