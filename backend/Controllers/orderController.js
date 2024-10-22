import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js";
import dotenv from 'dotenv'
import Stripe from "stripe";

dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY )
// placing userModel from frontend

const placeOrder = async (req,res)=> {

    const fromtend_url = "http://localhost:5173"
    
    try{
        //CREATING NEW ORDER
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();

        //CLEAR USER CART DATA
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
        

        //PREPARE STRIPE LINE ITEM
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100
            },
            quantity:item.quantity
        }))

        //ADDING DELIVERY CHARGES
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery charges"
                },
                unit_amount:50*100
            },
            quantity:1
        })
        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${fromtend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${fromtend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
           //RETURN SESSION URL TO FRONTEND
           console.log("Stripe session created",session)
        res.json({success:true,session_url:session.url})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) => {
            const {orderId,success} = req.body;
            try{
                if(success === "true"){
                    await orderModel.findByIdAndUpdate(orderId,{payment:true});
                    res.json({success:true,message:"Paid"})
                }else{
                    await orderModel.findByIdAndDelete(orderId);
                    res.json({success:false,message:"Not Paid"})
                }
                }catch(error){
                    console.log(error);
                    res.json({success:false,message:"Error"})

            }
}

// USER ORDER FOR FRONTEND

const userOrders = async (req,res) => {
   try{
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
   }catch(error){
    console.log(error);
    res.json({success:false,message:"Error"})
   }
}

export {placeOrder, verifyOrder,userOrders};