import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileNavbar from '../components/ProfileNavbar'
import { MdKeyboardArrowRight, MdOutlineUpdate } from 'react-icons/md'
import ConfirmModal from '../components/ConfirmModal'
import { profile_info, profile_update } from '../services/userService'
import OtpModal from '../components/OtpModal'
import AppContext from '../context/AppContext'

const Profile_info = () => {
  
  const {user,setUser}=useContext(AppContext);
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [originalProfile, setOriginalProfile] = useState({
                                                          username: user.username,
                                                          email: user.email,
                                                      });
  const [open, setOpen] = useState(false)
  const [openOtp, setOpenOtp] = useState(false)
  const navigate=useNavigate();
  function handleUpdate() {
      if (
          name === user.username &&
          email === user.email
      ) {
          alert("No changes detected.");
          setOpen(false);
          return;
      }
     setOpen(true);
  }
  function updateUser() {
     
     setOpen(false);
      setOpenOtp(true);
  }
  const update = async () => {
    try {
        await profile_update({
            username: name,
            email: email
        });

        setUser({
            username: name,
            email: email
        });

        setOpenOtp(false);

        alert("Profile updated successfully");

    } catch (err) {
       console.log(err.response?.data || err);
    }
};

  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
                <ProfileNavbar/>
                <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
                      <div className="text-sm font-bold text-black  text-start px-3">
                              Personal info  
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'> NAME</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your name' 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)}
                                                type="text"/>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400 uppercase'> EMAIL</h2>
                                                <input className="w-full bg-white rounded-xl text-md px-5 py-3"
                                                placeholder='Enter your email' 
                                                value={email} 
                                                
                                                type="email"/>
                                              </div>
                      </div>
                      <button style={{backgroundColor:'#3d84cd'}} 
                              onClick={()=>handleUpdate()}
                              className="w-full rounded-xl min-h-10 px-4 py-3 text-black flex gap-1 justify-center shadow-2xl">
                                  <MdOutlineUpdate className='text-2xl' />
                                  <p className='text-sm font-bold'>Update</p>
                      </button>
                      <ConfirmModal
                          isOpen={open}
                          title="Update"
                          message="Are you sure about your update details?"
                          confirmText="Update"
                          cancelText="Cancel"
                          onConfirm={updateUser}
                          onCancel={()=>setOpen(false)}
                          setOpen={setOpen}
                      />
                      <OtpModal
                        isOpen={openOtp}
                        title="Verify OTP"
                        message="Enter the OTP sent to your registered email."
                        confirmText="Verify OTP"
                        cancelText="Cancel"
                        purpose="profile-update"
                        onConfirm={update}
                        onCancel={() => setOpenOtp(false)}
                        setOpen={setOpenOtp}
                    />
                  </div>
              </div>

            </div>
      </div>
    </div>
  )
} 

export default Profile_info
