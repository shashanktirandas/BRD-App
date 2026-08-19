import React, { useContext, useEffect, useRef, useState } from 'react'
import { CiBookmark, CiHeart } from 'react-icons/ci';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdDeleteOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FiShare2 } from 'react-icons/fi';
import ConfirmModal from './ConfirmModal';
import { creator_delete_post } from '../services/creatorService';
import AppContext from '../context/AppContext';
import { bookmark_post, check_post_bookmark, check_post_like, dislike_post, like_post, remove_bookmark_post } from '../services/homeService';
import {
  HeartIcon as OutlineHeart,
  BookmarkIcon as OutlineBookmark,
} from "@heroicons/react/24/outline";

import {
  HeartIcon as SolidHeart,
  BookmarkIcon as SolidBookmark,
} from "@heroicons/react/24/solid";
import { getImageUrl } from '../utils/imageUrl';

export default function EditCard(props) {
  const [showMore, setShowMore] = useState(false);
  const [info, setInfo] = useState(false);
    const navigate=useNavigate();
    const sharePost = async () => {

        const shareUrl =
            `${window.location.origin}/post/${props.ele._id}`;

        try {

            if (navigator.share) {

                await navigator.share({
                    title: props.ele.birdName || "Bird Post",
                    text: "Check out this post.",
                    url: shareUrl
                });

            } else {

                await navigator.clipboard.writeText(shareUrl);

                alert("Post link copied!");

            }

        } catch (err) {

            if (err.name !== "AbortError") {
                console.log("Share failed:", err);
            }

        }
    };
    const menuRef = useRef(null);
    const {fetchPosts,creatorPosts,fetchCreatorPosts}=useContext(AppContext);
    useEffect(() => {
      fetchPostDetails();
      function handleClickOutside(event) {

        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setInfo(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const [like, setLike] = useState(false);
        const [bookmark, setBookmark] = useState(false);
        const fetchPostDetails = async () =>{
                                try {           
                                        const likeResponse = await check_post_like(props.ele._id);
                                        // console.log(likeResponse.data.data);
                                        setLike(likeResponse?.data?.data?.like || false);
                                        const bookmarkResponse = await check_post_bookmark(props.ele._id);
                                        setBookmark(bookmarkResponse?.data?.data?.bookmark || false);
                                } catch (err) {
                                    console.log(err);
                                    navigate('/');
                                }
                             
                  }
        const likeHandle= async()=>{
                    if(!like){
                      const response = await like_post(props.ele._id);
                    }else{
                      const response = await dislike_post(props.ele._id);
                    }
                    fetchPostDetails(); 
          } 
        const bookmarkHandle= async()=>{
                    if(!bookmark){
                      const response = await bookmark_post(props.ele._id);
                    }else{
                      const response = await remove_bookmark_post(props.ele._id);
                    }
                    fetchPostDetails(); 
          }          
        useEffect(()=>{
            fetchPostDetails();
        },[])
    const [open, setOpen] = useState(false)
     const deletePost = async () =>{
                        try {           
                                const response = await creator_delete_post(props.ele._id);
                                console.log(response);
                                fetchPosts();
                                fetchCreatorPosts();
                                setOpen(false);
                                console.log("Post deleted",props);
                        } catch (err) {
                            console.log(err);
                        }
                     
          }
  return (
    <div  className="gap-1 w-78 lg:w-90 min-h-80 p-2 shadow-xl rounded-lg pb-4  ">
                            <div 
                                  className="w-full flex justify-end text-lg text-black relative"
                                  ref={menuRef} >
                                <HiOutlineDotsHorizontal 
                                      className="text-lg text-black cursor-pointer"
                                      onClick={() => setInfo((prev) => !prev)}
                                      />
                                {info && (
                                  <div className="absolute top-3 right-4  min-h-5 px-2 py-2 bg-white rounded-sm text-sm text-black gap-1 flex flex-col items-start shadow-[0_0_16px_rgba(0,0,0,0.5)]">
                                  <button onClick={()=>navigate(`/edit-post/${props.ele._id}`)} className="  flex justify-center bg-gray-100 p-1 px-2 items-center gap-1 rounded-sm">
                                     <p>Edit</p> <FiEdit className='text-sm' />
                                      </button>
                                  <button 
                                   className=" flex justify-center bg-gray-100 p-1 px-2 items-center gap-1 rounded-sm text-red-500"
                                   onClick={()=>setOpen(true)}
                                   > 
                                    <p>Delete</p><MdDeleteOutline className='text-xl' />
                                    </button>
                                </div>
                                )}
                                
                            </div>
                               <button className='w-full gap-1 text-start' onClick={()=>navigate(`/post-view/${props.ele._id}`)} >
                            <img style={{backgroundColor:'#00000066'}} className='w-full h-55 lg:h-60      rounded-lg' src={getImageUrl(props.ele.images?.[0])} alt="Post photo" />
                             </button>
                             <div className="pl-1 pt-1 w-full flex justify-between text-black">
                              <div className=" text-sm font-bold">{props.ele.birdName}</div>
                              <div className="flex items-center gap-1">
                                      {/* Like Button */}
                                      <button
                                        onClick={() => likeHandle()}
                                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                                      >
                                        {like ? (
                                          <SolidHeart className="w-7 h-7 text-red-500" />
                                        ) : (
                                          <OutlineHeart className="w-7 h-7 text-gray-800" />
                                        )}
                                      </button>

                                      {/* Bookmark Button */}
                                      <button
                                        onClick={() => bookmarkHandle()}
                                        className="transition-transform duration-200 hover:scale-110 active:scale-95"
                                      >
                                        {bookmark ? (
                                          <SolidBookmark className="w-7 h-7 text-black" />
                                        ) : (
                                          <OutlineBookmark className="w-7 h-7 text-gray-800" />
                                        )}
                                      </button>
                                        {/* Share Button */}
                                        <button
                                            onClick={sharePost}
                                            className="transition-transform duration-200 hover:scale-110 active:scale-95"
                                        >
                                            <FiShare2 className="w-6 h-6 text-gray-800" />
                                        </button>
                                    </div>
                             </div>
                             <p className={`pl-1 text-[12px] font-semibold text-gray-400 ${
                                  showMore ? "" : "line-clamp-2"
                                }`}
                              >
                                {props.ele.description}
                              </p>
                               
                              {!showMore && (
                                      <button
                                          onClick={() => setShowMore(true)}
                                          className="relative z-10 pl-1 text-xs text-gray-500 cursor-pointer "
                                        >
                                          more
                                        </button>
                                    )}
                              {
                                showMore && (
                                  <>
                                  <div className="pl-1 text-[12px] font-semibold text-blue-400 flex flex-wrap gap-2">
                                              {props.ele.tags?.map((tag, index) => (
                                                  <span key={`${tag}-${index}`} className="mr-1">
                                                      #{tag}
                                                  </span>
                                              ))}
                                            </div>
                                    <button
                                          onClick={() => setShowMore(false)}
                                          className="pl-1 text-xs text-gray-500"
                                        >
                                          less
                                    </button>
                                  </>
                                )
                              }
                              <ConfirmModal
                            isOpen={open}
                            title="Deleting your post"
                            message="Are you sure to delete this post."
                            confirmText="Delete"
                            cancelText="Not Now"
                            onConfirm={deletePost}
                            onCancel={() => setOpen(false)}
                            setOpen={setOpen}
                        />     
                             
                           </div>
  )
}
