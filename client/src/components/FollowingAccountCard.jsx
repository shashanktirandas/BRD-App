import React, { useEffect, useState } from 'react'
import { CiBookmark, CiHeart } from 'react-icons/ci';
import { FaBookmark, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdBookmark, IoMdHeart } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon as OutlineHeart,
  BookmarkIcon as OutlineBookmark,
} from "@heroicons/react/24/outline";

import {
  HeartIcon as SolidHeart,
  BookmarkIcon as SolidBookmark,
} from "@heroicons/react/24/solid";

import { bookmark_post, check_follow, check_post_bookmark, check_post_like, dislike_post, follow_creator, follow_post_creator, like_post, remove_bookmark_post, unfollow_creator, unfollow_post_creator } from '../services/homeService';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import { getImageUrl } from '../utils/imageUrl';
const FollowingAccountCard = (props) => {
    const navigate=useNavigate();
    const [follow, setFollow] = useState(false);
   const fetchAccount = async () => {
         try {
           const followRes = await check_follow(props.ele._id);
           setFollow(followRes?.data?.data?.follow || false);
         } catch (err) {
           console.log(err);
           //navigate("/creator");
         }
     };
     const followHandle= async()=>{
                 if(follow){
                   const response = await unfollow_creator(props.ele._id);
                 }else{
                   const response = await follow_creator(props.ele._id);
                 }
                 fetchAccount();
       }
    useEffect(() => {
          fetchAccount();
        }, [props.ele._id]);
  return (
    <div className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black flex items-center ">
                                        <button onClick={()=>navigate(`/creator/${props.ele._id}`)} className="w-full h-full   px-3 flex  gap-3 items-center">
                                          <img className='w-10 h-10  shadow-2xl object-cover rounded-md' src={getImageUrl(props.ele.profileImage)} alt="Creator profile photo" />
                                            <div className="text-sm font-bold text-black  text-start">
                                                {props.ele.displayName}
                                            </div>
                                        </button>
                                        <button 
                                        onClick={()=>followHandle()}
                                        className='text-[12px] font-semibold text-white px-2.5 py-0.5 bg-blue-600 rounded-sm'
                                        >
                                           {follow?'Following':'Follow'}
                                      </button>
                                  </div>
  )
}

export default FollowingAccountCard
