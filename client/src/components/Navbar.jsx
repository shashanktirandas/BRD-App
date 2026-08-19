import React from 'react'
import brd_logo from '../img/brd-logo.png'
import { CiSearch , CiHeart } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div style={{backgroundColor:'#99d66f'}} className="w-full h-14 rounded-b-lg pl-7 p-1 pr-2 flex justify-between items-center text-black">
                       <button onClick={()=>navigate('/')}  className="flex gap-2 ">
                            <img style={{backgroundColor:'#00000011'}} className='w-9 h-9 object-contain' src={brd_logo} alt="Brd logo" />
                            <div className="text-2xl font-bold">BRD</div>
                       </button>
                       <div className=" flex gap-2 lg:gap-6 lg:pr-3 items-center ">
                        <Link to={`/search`}>
                        <IoSearchOutline className="w-6 h-6 rounded-full" />
                        </Link>
                        <Link to={'/notification'}>
                        <CiHeart className="w-7 h-7  rounded-full" />
                        </Link>
                        <Link to={'/profile'}>
                        <FaUserCircle className="w-7 h-7 rounded-full" />
                        </Link>
                       </div>
    </div>
  )
}

export default Navbar
