import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//placing user order for frontend
const placeOrder = async (req, res) => {

    const frontend_url = process.env.URL; //according to frontend url
    try {  //new order created
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        //order saved into database
        await newOrder.save();
        //cleaaring users's cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        //whatever item we get from the user we will tke it in line_items that is necessary for stripe payment
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80 //coz inr
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })
        //created a session using below mentioned things 
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

        })
        //sending session url as a response 8.3
        res.json({ success: true, session_url: session.url })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "error" })
    }
}

//to verify order
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "Paid" })
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

//user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

//listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}
//9.20 par error

//api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "status updated" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Errr" })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };