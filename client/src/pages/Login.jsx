import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import brd_logo from '../img/brd-logo.png' 
import { login } from '../services/authService';
import AppContext from '../context/AppContext';
import {
    Eye,
    EyeOff
} from "lucide-react";
const Login = () => {
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate=useNavigate();
    const { setToken } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loginState, setLoginState] = useState(null);
    const handleLogin = async (e) => {

        e.preventDefault();

        // Basic required-field checks
        if (!username.trim()) {
            alert("Please enter username.");
            return;
        }

        if (!password) {
            alert("Please enter password.");
            return;
        }

        try {

            // STEP 1
            setLoginState({
                step: "checking",
                message: "Checking your details..."
            });

            await new Promise(resolve =>
                setTimeout(resolve, 350)
            );

            // STEP 2
            setLoginState({
                step: "verifying",
                message: "Verifying your account..."
            });

            const response = await login({
                username: username.trim(),
                password
            });

            console.log(
                "Login response:",
                response.data
            );

            // STEP 3
            setLoginState({
                step: "session",
                message: "Preparing your session..."
            });

            localStorage.setItem(
                "token",
                response.data.data.token
            );

            setToken(
                response.data.data.token
            );

            // STEP 4
            setLoginState({
                step: "success",
                message: "Welcome back!"
            });

            await new Promise(resolve =>
                setTimeout(resolve, 700)
            );

            navigate("/");

        } catch (err) {

            console.error(
                "Login error:",
                err.response?.data || err
            );

            setLoginState(null);

            const backendMessage =
                err.response?.data?.message;

            if (backendMessage) {

                try {

                    const parsed =
                        JSON.parse(backendMessage);

                    if (
                        Array.isArray(parsed) &&
                        parsed.length > 0
                    ) {

                        const firstMessage =
                            parsed
                                .map(item => item.message)
                                .find(Boolean);

                        alert(
                            firstMessage ||
                            "Invalid input."
                        );

                        return;
                    }

                } catch {
                    // Normal backend message
                }

                alert(backendMessage);

                return;
            }

            alert(
                "Something went wrong. Please try again."
            );
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
                      <h2 className='text-3xl lg:text-4xl text-black font-bold w-60 text-center '>Login</h2>
                      <Link to={'/signup'}><p className='text-[12px] text-gray-400 font-semibold'>Sign in to continue.</p></Link>
                    </div>
                  </div>
  
                  <div className=" relative text-start w-full rounded-xl  min-h-10 px-4 py-3 text-black flex flex-col gap-2 items-center ">
                                                <div className="w-full h-full flex flex-col justify-between  gap-2">
                                                  <h2 className='text-[12px]  font-semibold text-gray-400'>Username</h2>
                                                  <input className="w-full bg-gray-100 rounded-2xl text-md px-5 py-3"
                                                  placeholder='Enter username' 
                                                  value={username} 
                                                  onChange={(e) => setUsername(e.target.value)}
                                                  type="text"/>
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
                                                <button
                                                    onClick={(e) => handleLogin(e)}
                                                    disabled={!!loginState}
                                                    style={{ backgroundColor: '#99d66f' }}
                                                    className="
                                                        relative
                                                        mt-3
                                                        w-full
                                                        h-12
                                                        text-sm
                                                        text-black
                                                        px-4
                                                        rounded-xl
                                                        font-semibold
                                                        overflow-hidden
                                                        transition-all
                                                        duration-200
                                                        disabled:cursor-not-allowed
                                                    "
                                                >
                                                    {loginState ? (
                                                        <>
                                                            {/* animated background */}
                                                            <span
                                                                className="
                                                                    absolute
                                                                    inset-0
                                                                    bg-black/5
                                                                    animate-pulse
                                                                "
                                                            />

                                                            <span className="
                                                                relative
                                                                flex
                                                                items-center
                                                                justify-center
                                                                gap-3
                                                            ">
                                                                {loginState.step === "success" ? (
                                                                    <span className="
                                                                        w-5
                                                                        h-5
                                                                        rounded-full
                                                                        bg-green-600
                                                                        text-white
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                        text-xs
                                                                        font-bold
                                                                    ">
                                                                        ✓
                                                                    </span>
                                                                ) : (
                                                                    <span className="
                                                                        w-5
                                                                        h-5
                                                                        border-[2.5px]
                                                                        border-black/20
                                                                        border-t-black
                                                                        rounded-full
                                                                        animate-spin
                                                                    " />
                                                                )}

                                                                <span>
                                                                    {loginState.message}
                                                                </span>
                                                            </span>
                                                        </>
                                                    ) : (
                                                        "Login"
                                                    )}
                                                </button>
                                {loginState && (
                                    <div className="
                                        absolute
                                        inset-0
                                        z-20
                                        rounded-2xl
                                        bg-white/90
                                        backdrop-blur-sm
                                        flex
                                        items-center
                                        justify-center
                                        p-6
                                    ">

                                    {/* TOP STATUS */}
                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className="
                                            w-9
                                            h-9
                                            rounded-full
                                            bg-gray-50
                                            border
                                            border-gray-100
                                            flex
                                            items-center
                                            justify-center
                                            shrink-0
                                        ">

                                            {loginState.step === "success" ? (
                                                <span className="
                                                    w-6
                                                    h-6
                                                    rounded-full
                                                    bg-green-500
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-bold
                                                    text-sm
                                                ">
                                                    ✓
                                                </span>
                                            ) : (
                                                <span className="
                                                    w-5
                                                    h-5
                                                    border-[2.5px]
                                                    border-gray-200
                                                    border-t-black
                                                    rounded-full
                                                    animate-spin
                                                " />
                                            )}

                                        </div>

                                        <div>

                                            <p className="
                                                text-sm
                                                font-bold
                                                text-gray-900
                                            ">
                                                {loginState.message}
                                            </p>

                                            <p className="
                                                text-[11px]
                                                text-gray-400
                                                mt-0.5
                                            ">
                                                {loginState.step === "success"
                                                    ? "Opening your BRD feed..."
                                                    : "Please wait while we sign you in."
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* PROGRESS STEPS */}

                                    <div className="
                                        mt-4
                                        flex
                                        items-center
                                        gap-2
                                    ">

                                        {/* STEP 1 */}

                                        <div className={`
                                            h-1.5
                                            flex-1
                                            rounded-full
                                            transition-all
                                            duration-500
                                            ${
                                                ["checking", "verifying", "session", "success"]
                                                    .includes(loginState.step)
                                                    ? "bg-black"
                                                    : "bg-gray-100"
                                            }
                                        `} />


                                        {/* STEP 2 */}

                                        <div className={`
                                            h-1.5
                                            flex-1
                                            rounded-full
                                            transition-all
                                            duration-500
                                            ${
                                                ["verifying", "session", "success"]
                                                    .includes(loginState.step)
                                                    ? "bg-black"
                                                    : "bg-gray-100"
                                            }
                                        `} />


                                        {/* STEP 3 */}

                                        <div className={`
                                            h-1.5
                                            flex-1
                                            rounded-full
                                            transition-all
                                            duration-500
                                            ${
                                                ["session", "success"]
                                                    .includes(loginState.step)
                                                    ? "bg-black"
                                                    : "bg-gray-100"
                                            }
                                        `} />


                                        {/* STEP 4 */}

                                        <div className={`
                                            h-1.5
                                            flex-1
                                            rounded-full
                                            transition-all
                                            duration-500
                                            ${
                                                loginState.step === "success"
                                                    ? "bg-green-500"
                                                    : "bg-gray-100"
                                            }
                                        `} />

                                    </div>


                                    {/* STEP LABELS */}

                                    <div className="
                                        mt-2
                                        flex
                                        justify-between
                                        text-[9px]
                                        text-gray-400
                                    ">

                                        <span>Check</span>
                                        <span>Verify</span>
                                        <span>Session</span>
                                        <span>Ready</span>

                                    </div>

                                </div>
                            )}
                                                </div>
                        
                          
                </div>
                
              </div>
               
              <div className="absolute bottom-0 left-0 w-full h-10 md:h-20 lg:h-20 bg-[#3d84cd]"
                            style={{
                              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                            }}
                          >
                           
                          </div>
                
        </div>
        
      </div>
    )
}

export default Login
