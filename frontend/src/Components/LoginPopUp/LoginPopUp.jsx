import React, { useContext, useEffect, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
const LoginPopUp = ({setShowLogin}) => {
  const {url,setToken} = useContext(StoreContext)

const [currentState,setCurrentState] = useState("Signup")

const [data,setData] = useState({
  name:'',
  email:'',
  password:''
})

const onChangeHandler = (event) => {
  setData({
    ...data,
    [event.target.name]: event.target.value,
  });
};




const onLogin = async (event) => {
  event.preventDefault()
  let newUrl = url;
  if(currentState === "Login"){
      newUrl += "/api/user/login"
  }else{
    newUrl += "/api/user/register"
  }

  const response = await axios.post(newUrl,data);

  if(response.data.success){
   
    setToken(response.data.token);
    localStorage.setItem("token",response.data.token)
    setShowLogin(false)
  }else{
    alert(response.data.mesage)
  }
}





  return (
    <div className='login-popup'> 
      <form onSubmit={onLogin} className='login-popup-container' >
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=''/>

        </div>
        <div className="login-popup-input">
          {currentState==="Login"?<></>:
           <input type='text' placeholder='Your name' required name='name' value={data.name} onChange={onChangeHandler}/>
          }
         
          <input type='email' placeholder='Your email' required name='email' value={data.email} onChange={onChangeHandler}/>
          <input type='password' placeholder='Your password' required name='password' value={data.password} onChange={onChangeHandler}/>

        </div>
        <button type='submit'>{currentState==="Sign Up"?"Create account":"Login"}</button>
        <div className="login-popup-condition">
          <input type='checkbox'required/>
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currentState==="Login"
        ?  <p>Create a new account ? <span onClick={()=>setCurrentState("Sign Up")}>Click Here</span></p>
        :  <p>Already have an account? <span onClick={()=>setCurrentState("Login")}>Click Here</span></p>
        }
       
       
      </form>
    </div>
  )
}

export default LoginPopUp
