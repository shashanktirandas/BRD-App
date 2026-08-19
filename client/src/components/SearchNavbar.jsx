import React, { useContext } from "react";
import brd_logo from '../img/brd-logo.png'
import { CiSearch , CiHeart } from "react-icons/ci";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import AppContext from "../context/AppContext";
const SearchNavbar = () => {

    const {
        searchQuery,
        setSearchQuery
    } = useContext(AppContext);

    const navigate = useNavigate();
  return (
    <div className="">
            <div style={{backgroundColor:'#99d66f'}} className="w-full h-14 rounded-b-lg px-3 py-2 flex justify-center items-center text-black">
                       <div  className="w-full h-full bg-white rounded-xl flex p-1 px-2 max-w-160 ">
                            <input onClick={()=>navigate(`/search`)} className='w-full h-full text-lg px-3 py-1 ' placeholder='Search for brds...' 
                                  value={searchQuery} 
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  type="text" />
                            <button onClick={()=>navigate('/')}>
                            <img style={{backgroundColor:'#00000000'}} className='w-8 h-8 object-cover' src={brd_logo} alt="" />
                            </button>
                       </div>
            </div>
            
    </div>
    
  )
}

export default SearchNavbar
