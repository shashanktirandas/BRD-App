import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Menubar from '../components/Menubar';
import PostCard from '../components/PostCard';
import AppContext from '../context/AppContext';
import ProfileNavbar from '../components/ProfileNavbar';
import { CiBookmark, CiHeart } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { FaArrowUp } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { creator_delete_post, creator_getsinglepost } from '../services/creatorService';
import { get_post_bookmarks, get_post_likes } from '../services/homeService';
import { getImageUrl } from '../utils/imageUrl';

const Post = () => {
  const [showMore, setShowMore] = useState(false);
    const navigate=useNavigate();
     
    const {id}=useParams();
    const {posts,setPosts,menu,setMenu,post,setPost,fetchPosts,fetchCreatorPosts }=useContext(AppContext);
    const [likes, setLikes] = useState(0);
    const [bookmarks, setBookmarks] = useState(0)
    const [views, setViews] = useState(123)
    const [open, setOpen] = useState(false)
            const deletePost = async () =>{
                                    try {           
                                            const response = await creator_delete_post(post._id);
                                            //console.log(response);
                                            fetchCreatorPosts();
                                            fetchPosts();
                                            setOpen(false);
                                            console.log("Post deleted",post);
                                            navigate('/creator')
                                    } catch (err) {
                                        console.log(err);
                                    }
                                 
                      }
    const menuRef = useRef(null);
    const [info, setInfo] = useState(false)
    const fetchPost = async () =>{
                    try {           
                            const response = await creator_getsinglepost(id);
                            //console.log(response.data.data.post);
                            const likeResponse = await get_post_likes(id);
                            if (likeResponse?.data?.data?.coute) {
                                setLikes(likeResponse.data.data.coute);
                            } else {
                                setLikes(0);
                            }
                            const bookmarkResponse = await get_post_bookmarks(id);
                            if (bookmarkResponse?.data?.data?.coute) {
                                setBookmarks(bookmarkResponse.data.data.coute);
                            } else {
                                setBookmarks(0);
                            }
                            if (response?.data?.data?.post) {
                                setPost(response.data.data.post);
                            } else {
                                setPost(null);
                            }
                            
                    } catch (err) {
                        console.log(err);
                        navigate('/creator');
                    }
                 
      } 
    useEffect(() => {
          fetchPost();
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
    return (
      <div>
        <div className="w-full min-h-screen bg-white relative  ">
                  <ProfileNavbar />
                  
                  <div className="w-full flex gap-2 flex-col items-center justify-center pt-4 pb-15 px-4 ">
  
                    <div className="w-full  flex flex-col gap-3 items-center ">
                     <div className="min-w-full items-center  flex flex-col gap-3">
                            {
                              post && (
                                <div  className="gap-1 w-full lg:w-230  min-h-80 p-2 shadow-xl rounded-lg pb-4  ">
                                                        <div 
                                                                                          className="w-full flex justify-end text-lg text-black relative"
                                                                                          ref={menuRef} >
                                                                                        <HiOutlineDotsHorizontal 
                                                                                              className="text-lg text-black cursor-pointer"
                                                                                              onClick={() => setInfo((prev) => !prev)}
                                                                                              />
                                                                                        {info && (
                                                                                          <div className="absolute top-3 right-4  min-h-5 px-2 py-2 bg-white rounded-sm text-sm text-black gap-1 flex flex-col items-start shadow-[0_0_16px_rgba(0,0,0,0.5)]">
                                                                                          <button onClick={()=>navigate(`/edit-post/${id}`)} className="  flex justify-center bg-gray-100 p-1 px-2 items-center gap-1 rounded-sm">
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
                                                        <div className="lg:flex lg:gap-2">
                                                        <img style={{backgroundColor:'#00000066'}} className='w-full   h-65 md:h-100 lg:h-90 rounded-lg' src={getImageUrl(post?.images?.[0])} alt="Post photo" />
                                                         <div className="w-full lg:w-[80%] lg:pt-5 flex flex-col lg:gap-2 gap-1">
                                                         <div className="pl-1 pt-1 w-full flex justify-between text-black">
                                                          <div className=" text-sm font-bold">{post.birdName}</div>
                                                          
                                                         </div>
                                                         <div className="">
                                                         <p className={`pl-1 text-[12px] font-semibold text-gray-400 ${
                                                              showMore ? "" : "line-clamp-2"
                                                            }`}
                                                          >
                                                            {post.description}
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
                                                                          {post.tags.map((tag, index) => (
                                                                            <span key={index}>#{tag}</span>
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
                                                          </div>
                                                         
                        
                                                         </div>
                                                        </div>
                                                       </div>
                              )
                            }
                            

                            <div className="w-full  flex flex-col gap-3 lg:w-230">
                        <div className="text-sm font-bold text-black  text-start px-3">
                                Overview
                        </div> 
                        <div className="flex gap-2 flex-wrap">
                        <div className="text-start rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black flex">
                                                <div className=" h-full flex  justify-between  gap-3 items-center px-2">
                                                   <CiHeart className="w-19 h-19  rounded-xl bg-white p-3 text-red-600" />
                                                   <div className=" flex flex-col">
                                                  <h2 className='text-sm  font-semibold text-gray-400'>Total likes</h2>
                                                  <h3 className='text-xl font-bold text-black'>{likes}</h3>
                                                  <div className="text-[12px] flex gap-1 font-semibold text-gray-400 ">
                                                    <p className='flex text-green-400 items-center'><FaArrowUp /> 12.5%</p>
                                                    <p>vs last 7 days</p>
                                                  </div>
                                                  </div>
                                                </div>
                        </div>
                        <div className="text-start rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black flex">
                                                <div className=" h-full flex  justify-between  gap-3 items-center px-2">
                                                  
                                                   <CiBookmark className="w-19 h-19  rounded-xl bg-white p-3 text-orange-400" />
                                                   <div className=" flex flex-col">
                                                  <h2 className='text-sm  font-semibold text-gray-400'>Totle bookmarks</h2>
                                                  <h3 className='text-xl font-bold text-black'>{bookmarks}</h3>
                                                  <div className="text-[12px] flex gap-1 font-semibold text-gray-400 ">
                                                    <p className='flex text-green-400 items-center'><FaArrowUp /> 12.5%</p>
                                                    <p>vs last 7 days</p>
                                                  </div>
                                                  </div>
                                                </div>
                        </div>
                        <div className="text-start rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-black flex">
                                                <div className=" h-full flex  justify-between  gap-3 items-center px-2">
                                                  
                                                   <IoEyeOutline className="w-19 h-19  rounded-xl bg-white p-3 text-blue-400" />
                                                   <div className=" flex flex-col">
                                                  <h2 className='text-sm  font-semibold text-gray-400'>Total views</h2>
                                                  <h3 className='text-xl font-bold text-black'>{views}</h3>
                                                  <div className="text-[12px] flex gap-1 font-semibold text-gray-400 ">
                                                    <p className='flex text-green-400 items-center'><FaArrowUp /> 12.5%</p>
                                                    <p>vs last 7 days</p>
                                                  </div>
                                                  </div>
                                                </div>
                        </div>
                        </div>
                                  
                    </div>

                     </div>
                    <div className="w-full  flex flex-col gap-3  ">
                    
                    </div>
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
                  </div>  
        </div>
      </div>
    )
}

export default Post
