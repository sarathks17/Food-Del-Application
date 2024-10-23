import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js";
import dotenv from 'dotenv'
import Stripe from "stripe";

dotenv.config();

// INITIALIZING STRIPE WITH THE SECRET KEY FROM  ENVIRONMENT VARIABLES
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY )


//FUNCTION TO PLACE AN ORDER
const placeOrder = async (req,res)=> {
//SETTING FRONTEND URL
const fromtend_url = "https://food-delevery-application-frontend.onrender.com/"
    
    try{
 //CREATING NEW ORDER
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
//SAVING NEW ORDER TO THE DATABASE
        await newOrder.save();

//CLEAR USER CART DATA
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
        

//PREPARE STRIPE LINE ITEM
        const line_items = req.body.items.map((item)=>({
//SETTING THE CURRENCY TO INR
            price_data:{
                currency:"inr",
//USING ITEMS NAME FOR THE STRIPE PRODUCT DATA
                product_data:{
                    name:item.name
                },
//CONVERTING THE PRICE TO THE SMALLEST CURRENCY UNIT
                unit_amount:item.price*100
            },
 //QUANTITY FOR THE ITEM
            quantity:item.quantity
        }))

//ADDING DELIVERY CHARGES
        line_items.push({
//SETTING CURRENCY FOR DELIVERY CHARGES
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery charges"
                },
//SETTING A FIXED DELIVERY CHARGE
                unit_amount:50*100
            },
            quantity:1
        })
//CREATING A STRIPE SECTOIN FOR THE CHECKOUT PROCESS
        const session = await stripe.checkout.sessions.create({
//USING PREPARED LINE ITEMS FOR THE STRIPE SESSION
         line_items:line_items,
//SETTING THE PAYMENT MODE
            mode:'payment',
 //URL TO REDIRECT ON PAYMENT SUCCESS
            success_url:`${fromtend_url}/verify?success=true&orderId=${newOrder._id}`,
 //URL TO REDIRECT ON PAYMENT CANCELLATION
            cancel_url:`${fromtend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
//RETURN SESSION URL TO FRONTEND
           console.log("Stripe session created",session)
//RETURNING THE SESSION URL TO THE FRONTEND
        res.json({success:true,session_url:session.url})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}
//FUNCTION TO VERIFY THE ORDER AFTER PAYMENT
const verifyOrder = async (req,res) => {
            const {orderId,success} = req.body;
            try{
                if(success === "true"){
//MARK THE ORDER AS PAID IN THE DATABASE
                    await orderModel.findByIdAndUpdate(orderId,{payment:true});
                    res.json({success:true,message:"Paid"})
                }else{
//IF PAYMENT FAILED DELETE THE ORDER FROM THE DATABASE
                    await orderModel.findByIdAndDelete(orderId);
                    res.json({success:false,message:"Not Paid"})
                }
                }catch(error){
                    console.log(error);
                    res.json({success:false,message:"Error"})

            }
}


//FUNCTION TO GET THE LIST OF USER ORDERS
const userOrders = async (req,res) => {
   try{
//FIND ALL ORDERS FOR THE GIVEN USER ID AND SEND AS RESPONSE
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
   }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
   }
}

export {placeOrder, verifyOrder,userOrders};
