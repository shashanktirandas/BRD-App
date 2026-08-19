import React, { useContext } from 'react'
import AppContext from '../context/AppContext'
import { VscDiffAdded, VscLightbulbSparkle } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

const CreatorSlideBar = () => {
    const {role}=useContext(AppContext);
    if(role !== "creator") return null;
  return (
    <div>
      
         <div className=" z-10 fixed bottom-[2%] right-[10%] lg:right-[2%] min-h-10 p-3 shadow-[0_0_16px_rgba(0,0,0,0.5)] rounded-lg bg-white flex gap-3 items-center text-3xl text-black">
            <Link to={'/creator'}>
            <VscLightbulbSparkle />
            </Link>
            <Link to={'/upload'}>
            <VscDiffAdded />
            </Link>
         </div>
 
    </div>
  )
}

export default CreatorSlideBar
