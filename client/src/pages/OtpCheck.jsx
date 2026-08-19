import React, { useEffect, useRef, useState } from 'react'
import brd_logo from '../img/brd-logo.png' 
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';

const OtpCheck = () => {
      const navigate=useNavigate(); 
    

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const handleOtp = async () => {
    const userid = localStorage.getItem("userid");

    try {
        const response = await signup({
            id: userid,
            enteredOTP: otp.join("")
        });

        console.log(response.data);
        navigate("/login");

    } catch (err) {
        console.log(err.response?.data);
    }
  };
  useEffect(() => {
        if (otp.every(digit => digit !== "")) {
            handleOtp();
        }
    }, [otp]);
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };
      return (
        <div>
          <div className="w-full min-h-screen bg-white relative  ">
                <div className="w-full  flex flex-col gap-3 items-center bg-white  absolute top-0 z-10 ">
                       <div className="w-full md:w-100 lg:w-100 flex flex-col gap-3">
                    <div className="w-full flex flex-col items-center">
                      <img className='w-35 h-35 object-cover ' src={brd_logo} alt="" />
                      <h1 className='text-2xl font-bold text-black'>BRD</h1>
                    </div>
                    <div className="w-full flex flex-col items-center mt-10">
                      <div className="flex flex-col items-center gap-1">
                        <h2 className='text-3xl lg:text-4xl text-black font-bold w-60 text-center '>OTP SENT</h2>
                        <Link to={'/login'}><p className='text-[12px] text-gray-400 font-semibold'>Already Registered? Log in here.</p></Link>
                      </div>
                    </div>
    
                    <div className="text-start w-full rounded-xl  min-h-10 px-4 py-3 text-black flex flex-col gap-2 items-center ">
                                                  <div className=" h-full flex flex-col justify-between  gap-2 ">
                                                    <h2 className='text-[12px]  font-semibold text-gray-400'>OTP</h2>
                                                    <div className="flex gap-3">
                                                              {otp.map((digit, index) => (
                                                                <input
                                                                  key={index}
                                                                  ref={(el) => (inputs.current[index] = el)}
                                                                  type="text"
                                                                  inputMode="numeric"
                                                                  maxLength={1}
                                                                  value={digit}
                                                                  onChange={(e) => handleChange(index, e.target.value)}
                                                                  onKeyDown={(e) => handleKeyDown(index, e)}
                                                                  className="w-15 h-15 rounded-2xl bg-gray-100 text-center text-2xl font-semibold outline-none focus:ring-2 focus:ring-blue-500"
                                                                />
                                                              ))}
                                                            </div>
                                                  </div>
                                                  
                          </div>
                          
                            
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

export default OtpCheck
