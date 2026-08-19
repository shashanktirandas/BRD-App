import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import brd_logo from '../img/brd-logo.png'
import { partialSignup, partialSignupV2, signupV2 } from "../services/authService";
import OtpModal from '../components/OtpModal'
import AuthOtpModal from '../components/AuthOtpModal';
import {
    Eye,
    EyeOff
} from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openOtp, setOpenOtp] = useState(false)
  const handleSignup = async (e) => {

      e.preventDefault();

      // Basic required-field checks
      if (!username.trim()) {
          alert("Please enter username.");
          return;
      }

      if (!email.trim()) {
          alert("Please enter email.");
          return;
      }

      if (!password) {
          alert("Please enter password.");
          return;
      }

      try {

          const response = await partialSignupV2({
              username: username.trim(),
              email: email.trim(),
              password
          });

          console.log(
              "Signup response:",
              response.data
          );

          localStorage.setItem(
              "userid",
              response.data.data.userid
          );

          setOpenOtp(true);

      } catch (err) {

          console.error(
              "Signup error:",
              err.response?.data || err
          );

          const backendMessage =
              err.response?.data?.message;

          if (backendMessage) {

              try {

                  // Zod validation errors may arrive
                  // as a JSON string
                  const parsed =
                      JSON.parse(backendMessage);

                  if (
                      Array.isArray(parsed) &&
                      parsed.length > 0
                  ) {

                      const firstMessage = parsed
                          .map(item => item.message)
                          .find(Boolean);

                      alert(firstMessage || "Invalid input.");

                      return;
                  }

              } catch {
                  // Normal string message
              }

              alert(backendMessage);

              return;
          }

          alert(
              "Something went wrong. Please try again."
          );
      }
  };
  const signup=async()=>{
    const userid = localStorage.getItem("userid");
      try {
          const response = await signupV2({
                      id: userid
              });
          //console.log(response.data);
          setOpenOtp(false);
          navigate("/login");

      } catch (err) {
          console.log(err.response?.data);
      }
  }

  
  
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div className="w-full  flex flex-col gap-3 items-center bg-white  absolute top-0 z-10">
                   <div className="w-full md:w-100 lg:w-100 flex flex-col gap-3">
                <div className="w-full flex flex-col items-center">
                  <img className='w-35 h-35 object-cover ' src={brd_logo} alt="" />
                  <h1 className='text-2xl font-bold text-black'>BRD</h1>
                </div>
                <div className="w-full flex flex-col items-center ">
                  <div className="flex flex-col items-center gap-1">
                    <h2 className='text-3xl lg:text-4xl text-black font-bold w-60 text-center '>Create new Account</h2>
                    <Link to={'/login'}><p className='text-[12px] text-gray-400 font-semibold'>Already Registered? Log in here.</p></Link>
                  </div>
                </div>

                <div className="text-start w-full rounded-xl  min-h-10 px-4 py-3 text-black flex flex-col gap-2 items-center ">
                                              <div className="w-full h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>Username</h2>
                                                <input className="w-full bg-gray-100 rounded-2xl text-md px-5 py-3"
                                                placeholder='Enter username' 
                                                value={username} 
                                                onChange={(e) => setUsername(e.target.value)}
                                                type="text"/>
                                              </div>
                                              <div className="w-full h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>Email</h2>
                                                <input className="w-full bg-gray-100 rounded-2xl text-md px-5 py-3"
                                                placeholder='Enter email' 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"/>
                                              </div>
                                              <div className="w-full h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'>Password</h2>
                                                <div className="relative w-full">
                                                
                                                                                                      <input
                                                                                                          className="w-full bg-gray-100 rounded-2xl text-md px-5 py-3 pr-12 outline-none"
                                                                                                          placeholder="Enter password"
                                                                                                          value={password}
                                                                                                          onChange={(e) => setPassword(e.target.value)}
                                                                                                          type={showPassword ? "text" : "password"}
                                                                                                      />
                                                
                                                                                                      <button
                                                                                                          type="button"
                                                                                                          onClick={() => setShowPassword(!showPassword)}
                                                                                                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                                                                          aria-label={
                                                                                                              showPassword
                                                                                                                  ? "Hide password"
                                                                                                                  : "Show password"
                                                                                                          }
                                                                                                      >
                                                                                                          {showPassword ? (
                                                                                                                <EyeOff size={19} />
                                                                                                            ) : (
                                                                                                                <Eye size={19} />
                                                                                                            )}
                                                                                                      </button>
                                                
                                                                                                  </div>
                                              </div>
                                              <button onClick={(e)=>handleSignup(e)} style={{backgroundColor:'#99d66f'}} className='mt-3 w-full text-sm text-black px-4 py-3 rounded-sm'>signup</button>
                      </div>
                      <AuthOtpModal
                        isOpen={openOtp}
                        title="Verify OTP"
                        message="Enter the OTP sent to your registered email."
                        confirmText="Verify OTP"
                        cancelText="Cancel"
                        purpose="signup"
                        email={email}
                        onConfirm={signup}
                        onCancel={() => setOpenOtp(false)}
                        setOpen={setOpenOtp}
                    />
                        
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-10 md:h-20 lg:h-20 bg-[#3d84cd]"
                          style={{
                            clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                          }}
                        ></div>
      </div>
      
    </div>
  )
}

export default Signup
