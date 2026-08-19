import React from 'react'
import { Link } from 'react-router-dom'
import ProfileNavbar from '../components/ProfileNavbar'

const Notification = () => {
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
                <ProfileNavbar/>
                <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
                      <div className="text-sm font-bold text-black  text-start px-3">
                              Notifications 
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'> Update</h2>
                                                <p className='rounded-xl bg-gray-100 px-1 '>
                                                        Your applications is under development.
                                                </p>
                                              </div>
                      </div>
                      <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black">
                                              <div className=" h-full flex flex-col justify-between  gap-2">
                                                <h2 className='text-[12px]  font-semibold text-gray-400'> Update</h2>
                                                <p className='rounded-xl bg-gray-100 px-1 '>
                                                        Your applications is under development.
                                                </p>
                                              </div>
                      </div>
                      
                  </div>
              </div>

            </div>
      </div>
      
    </div>
  )
}

export default Notification
