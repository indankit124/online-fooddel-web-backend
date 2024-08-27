import express from 'express';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router()

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.post("/get", authMiddleware, getCart)
//yaha i have given post instead of get kyuki in frontend portion of Storecontext.jsx me loadCartDtaa function me bhi post hai so errors aarhe the
export default cartRouter