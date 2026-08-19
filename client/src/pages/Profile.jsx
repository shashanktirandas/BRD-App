import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProfileNavbar from '../components/ProfileNavbar'
import { MdAutoGraph, MdKeyboardArrowRight } from 'react-icons/md'
import Switch from "@mui/material/Switch";
import { CiLogout } from 'react-icons/ci'
import ConfirmModal from '../components/ConfirmModal'
import AppContext from '../context/AppContext'
import { useEffect } from 'react'

const Profile = () => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const {following,setFollowing,fetchFollowingAccounts,fetchSavedPosts,savePosts,setSavePosts,role}=useContext(AppContext);
  const [open, setOpen] = useState(false);
  function logout() {
        console.log("Logged out");
        setOpen(false);
        localStorage.removeItem("token");
        navigate('/signup');
  }
  
  useEffect(()=>{
    fetchFollowingAccounts();
    fetchSavedPosts();
    
  },[])
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
                <ProfileNavbar/>
                <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full lg:w-150 space-y-3">
                    <button onClick={()=>navigate('/personal-info')}  className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3  text-gray-400">
                        <div className=" h-full flex justify-between text-black">
                          <h2 className='text-sm  font-bold'> Personal info</h2>
                          <MdKeyboardArrowRight className='text-2xl font-semibold' />
                        </div>
                    </button>
                    <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 pr-2 text-gray-400">
                        <div className=" h-full flex justify-between items-center text-black">
                          <h2 className='text-sm  font-bold'> Mode</h2>
                          <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} />
                        </div>
                    </div>
                    {following?.length > 0  && (
                              <button onClick={()=>navigate('/following')} className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3  text-gray-400">
                                  <div className=" h-full flex justify-between text-black">
                                    <h2 className='text-sm  font-bold'> Following</h2>
                                    <MdKeyboardArrowRight className='text-2xl font-semibold' />
                                  </div>
                              </button>
                    )}
                    {savePosts?.length > 0 &&  (
                          <button onClick={()=>navigate('/saved-posts')} className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3  text-gray-400">
                                <div className=" h-full flex justify-between text-black">
                                  <h2 className='text-sm  font-bold'> Saved posts</h2>
                                  <MdKeyboardArrowRight className='text-2xl font-semibold' />
                                </div>
                            </button>
                    )}
                    
                    {role !== "creator" && (
                                    <button onClick={()=>navigate('/profile-transform')} className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3  text-gray-400">
                        <div className=" h-full flex justify-between text-black">
                          <h2 className='text-sm  font-bold'> Transform to creator</h2>
                          <MdKeyboardArrowRight className='text-2xl font-semibold' />
                        </div>
                    </button>
                    )}
                    
                    <button style={{backgroundColor:'#3d84cd'}} onClick={()=>setOpen(true)} className="w-full rounded-xl min-h-10 px-4 py-3 text-black flex gap-1 justify-center shadow-2xl">
                                                      <CiLogout className='text-2xl' />
                                                      <p className='text-sm font-bold'>Logout</p>
                                          </button>
                     <ConfirmModal
                          isOpen={open}
                          title="Logout"
                          message="Are you sure you want to logout?"
                          confirmText="Logout"
                          cancelText="Cancel"
                          onConfirm={logout}
                          onCancel={() => setOpen(false)}
                          setOpen={setOpen}
                      />
                      
                  </div>
              </div>
              

            </div>
      </div>
      
    </div>
  )
}

export default Profile
