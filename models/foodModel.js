import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel

//Mongoose Schema vs. Model.
//A Mongoose model is a wrapper on the Mongoose schema.
//A Mongoose schema defines the structure of the document,
//default values, validators, etc., whereas a Mongoose model provides an
//interface to the database for creating, querying, updating, deleting records, etc.