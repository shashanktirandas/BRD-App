import React, { useContext, useEffect, useRef, useState } from 'react'
import brd_logo from '../img/brd-logo.png'
import { Link } from 'react-router-dom';
import { send_otp, verify_otp } from '../services/otpService';
import AppContext from '../context/AppContext';

const OtpModal = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  purpose,
  onConfirm,
  onCancel,
  setOpen
}) => {

 
  const inputs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  const {fetchProfile}=useContext(AppContext);

  useEffect(() => {
    if (!isOpen) return;
    setOtp(["","","",""]);
    setError("");
    setTimeout(()=>{
        inputs.current[0]?.focus();
    },100);
    const sendOtp = async () => {
    try {
        console.log("Sending OTP...", { purpose });

        const response = await send_otp({ purpose });

        console.log("OTP Response:", response.data);

    } catch (err) {
        console.log("OTP Error:", err.response?.data || err);
    }
};

    sendOtp();

    setTimer(30);
    setCanResend(false);

    const interval = setInterval(() => {
        setTimer(prev => {
            if (prev === 1) {
                clearInterval(interval);
                setCanResend(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(interval);

}, [isOpen]);

  const handleChange = (index, value) => {

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }

  };

  const handleKeyDown = (index, e) => {

    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

  };

  const verifyOtp = async () => {

    const code = otp.join("");

    if (code.length !== 4) {
      setError("Please enter OTP.");
      return;
    }

    setError("");
    setLoading(true);
    try{
    
    const response = await verify_otp({
        otp: code,
        purpose
    });

    if(response.data.success){
        
        await onConfirm();
        //fetchProfile();

    }else{

        setError(response.data.message);

    }

    }catch(err){

        setError(
            err.response?.data?.message ||
            "Invalid OTP"
        );

    } finally {

      setLoading(false);

    }

  };

  const resendOtp = async()=>{

    try{

        await send_otp({purpose});

        setTimer(30);
        setCanResend(false);

    }catch(err){

        console.log(err);

    }

}

  if (!isOpen) return null;

  return (
    <div className="w-full min-h-screen bg-white fixed top-0 left-0 z-10"> 

      <div className="w-full flex flex-col gap-3 items-center bg-white ">

        <div
          className="w-full md:w-100 lg:w-100 flex flex-col gap-3"
        >

          <div className="w-full flex flex-col items-center">
            <img className='w-35 h-35 object-cover' src={brd_logo} alt="" />
            <h1 className='text-2xl font-bold text-black'>BRD</h1>
          </div>

          <div className="w-full flex flex-col items-center mt-10">
            <div className="flex flex-col items-center gap-1">
              <h2 className='text-3xl lg:text-4xl text-black font-bold w-60 text-center'>
                {title || "OTP SENT"}
              </h2>

              <p className='text-[12px] text-gray-400 font-semibold text-center'>
                {message || "Enter the OTP sent to your email."}
              </p>
            </div>
          </div>

          <div className="text-start w-full rounded-xl min-h-10 px-4 py-3 text-black flex flex-col gap-2 items-center">

            <div className="h-full flex flex-col justify-between gap-2">

              <h2 className='text-[12px] font-semibold text-gray-400'>
                OTP
              </h2>

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

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full rounded-xl min-h-10 px-4 py-3 text-white font-bold bg-[#3d84cd]"
            >
              {loading ? "Verifying..." : (confirmText || "Verify OTP")}
            </button>

            {canResend ? (

              <button
                onClick={resendOtp}
                className="text-[#3d84cd] font-semibold text-sm"
              >
                Resend OTP
              </button>

            ) : (

              <p className="text-gray-400 text-sm">
                Resend OTP in {timer}s
              </p>

            )}

            <button
              onClick={onCancel}
              className="text-red-500 text-sm font-semibold"
            >
              {cancelText || "Cancel"}
            </button>

          </div>

        </div>

      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-10 md:h-20 lg:h-20 bg-[#3d84cd]"
        style={{
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        }}
      ></div>

    </div>
  );
};

export default OtpModal;