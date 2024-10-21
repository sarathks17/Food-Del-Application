import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
const PlaceOrder = () => {
const {getTotalCartAmount} = useContext(StoreContext)

const [formData,setFormData] = useState({
        firstName:'',
        lastName:'',
        emailAddress:'',
        street:'',
        city:'',
        state:'',
        zipCode:'',
        country:'',
        phone:'',
})

const handleChange =(e) => {
  const {name,value} = e.target;
  setFormData((prevData)=>({
    ...prevData,
    [name]:value
  }));
};

const handleFormData = async (e) => {
  e.preventDefault();

  try{
    const response = await axios.post('http://localhost:3000/api/formdata',{
      firstName,
      lastName,
      emailAddress,
      street,
      city,
      state,
      zipCode,
      country,
      phone
    })
    console.log('Information send successful:', response.data.message);  // This should print the success message
    console.log('info :', response.data.info); 
  }catch(err){
    console.log('error submitting',err.response ? err.response.data :err);
  }
}

const handleSubmit = (e) => {

  console.log('Form submitted:',formData)
  handleFormData();
  
}



  return (
   <form className='place-order' onSubmit={handleSubmit}>
     <div className="place-order-left">
      <p className='title'>Delivery info</p>
      <div className="multi-fields">
        <input type='text' placeholder='First Name'/>
        <input type='text' placeholder='Last Name'/>
      </div>
      <input type="email" placeholder='Email address'/>
      <input type="text" placeholder='street'/>
      <div className="multi-fields">
        <input type='text' placeholder='City '/>
        <input type='text' placeholder='State '/>
        </div>
        <div className="multi-fields">
        <input type='text' placeholder='Zip code'/>
        <input type='text' placeholder='Country '/>
      </div>
      <input type='text' placeholder='Phone'/>
     
     </div>
     <div className="place-order-right">
     <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
          <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+0}</b>
            </div>
            <hr/>
          </div>
          <button >PROCEED TO PAYMENT</button>
        </div>
     </div>
   </form>
  )
}

export default PlaceOrder
