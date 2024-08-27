import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel

//Mongoose Schema vs. Model.
//A Mongoose model is a wrapper on the Mongoose schema.
//A Mongoose schema defines the structure of the document,
//default values, validators, etc., whereas a Mongoose model provides an
//interface to the database for creating, querying, updating, deleting records, etc.