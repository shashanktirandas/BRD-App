import React, { useContext, useEffect, useState } from 'react'
import SearchNavbar from '../components/SearchNavbar';
import Menubar from '../components/Menubar';
import PostCard from '../components/PostCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import card_photo from '../img/card-photo2.jpg'
import { Card } from '@mui/material';
import { CiBookmark, CiHeart } from 'react-icons/ci';
import AppContext from '../context/AppContext';
import { creator_getsinglepost } from '../services/creatorService';
import { getImageUrl } from '../utils/imageUrl';

import MasonrySkeleton from "../components/loading/MasonrySkeleton";

import {
    bookmark_post,
    check_post_bookmark,
    check_post_follow,
    check_post_like,
    dislike_post,
    follow_creator,
    follow_post_creator,
    get_post_bookmarks,
    get_post_likes,
    get_similar_posts,
    get_single_post,
    like_post,
    remove_bookmark_post,
    unfollow_creator,
    unfollow_post_creator
} from '../services/homeService';
import {
  HeartIcon as OutlineHeart,
  BookmarkIcon as OutlineBookmark,
} from "@heroicons/react/24/outline";

import {
  HeartIcon as SolidHeart,
  BookmarkIcon as SolidBookmark,
} from "@heroicons/react/24/solid";

const Post_user_view = () => {
  const [showMore, setShowMore] = useState(false);
  const [key, setKey] = useState('');
  const navigate=useNavigate();
  
  const {id}=useParams();
  const {
      post,
      setPost
  } = useContext(AppContext);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [similarMenu, setSimilarMenu] = useState(null);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [selectedSimilarMenu, setSelectedSimilarMenu] = useState(null);
    const [likes, setLikes] = useState(0);
    const [bookmarks, setBookmarks] = useState(0)
    const [views, setViews] = useState(123)
    const [follow, setFollow] = useState(false);
  const fetchPost = async () => {
      try {
        const [postRes, likeRes, bookmarkRes,followRes] = await Promise.all([
          get_single_post(id),
          get_post_likes(id),
          get_post_bookmarks(id),
          check_post_follow(id),
        ]);
        setFollow(followRes?.data?.data?.follow || false);
        setPost(postRes?.data?.data || []);
        setLikes(likeRes?.data?.data?.count || 0);
        setBookmarks(bookmarkRes?.data?.data?.count || 0);
        
      } catch (err) {
        console.log(err);
        //navigate("/creator");
      }
  };
  const fetchSimilarPosts = async () => {

      try {

          setLoadingSimilar(true);

          const response =
              await get_similar_posts(
                  id,
                  10,
                  "tag",
                  "Bird"
              );

          const data =
              response?.data?.data;

          setSimilarPosts(
              data?.posts || []
          );

          const tags = data?.menu?.tags || [];

          const orderedTags = [
              "Bird",
              ...tags.filter(tag => tag !== "Bird")
          ];

          setSimilarMenu({
              ...data?.menu,
              tags: orderedTags.slice(0, 20)
          });

          if (tags.includes("Bird")) {
              setSelectedSimilarMenu({
                  type: "tag",
                  value: "Bird"
              });
          }

      } catch (err) {

          console.log(
              "SIMILAR POSTS ERROR:",
              err
          );

          setSimilarPosts([]);
          setSimilarMenu(null);

      } finally {

          setLoadingSimilar(false);
      }
  };
  const selectSimilarMenu = async (type, value) => {

      const selection = {
          type,
          value
      };

      setSelectedSimilarMenu(selection);

      try {

          setLoadingSimilar(true);

          const response =
              await get_similar_posts(
                  id,
                  10,
                  type,
                  value
              );

          const data =
              response?.data?.data;

          setSimilarPosts(
              data?.posts || []
          );

      } catch (err) {

          console.log(
              "SIMILAR MENU ERROR:",
              err
          );

      } finally {

          setLoadingSimilar(false);
      }
  };
  const followHandle= async()=>{
              if(follow){
                const response = await unfollow_post_creator(id);
              }else{
                const response = await follow_post_creator(id);
              }
              fetchPost();
    }
    const [like, setLike] = useState(false);
    const [bookmark, setBookmark] = useState(false);
    const fetchPostDetails = async () =>{
                                try {           
                                        const likeResponse = await check_post_like(id);
                                        // console.log(likeResponse.data.data);
                                        setLike(likeResponse?.data?.data?.like || false);
                                        const bookmarkResponse = await check_post_bookmark(id);
                                        setBookmark(bookmarkResponse?.data?.data?.bookmark || false);
                                } catch (err) {
                                    console.log(err);
                                    navigate('/');
                                }
                             
                  }
        const likeHandle= async()=>{
                    if(!like){
                      const response = await like_post(id);
                    }else{
                      const response = await dislike_post(id);
                    }
                    fetchPostDetails(); 
          } 
        const bookmarkHandle= async()=>{
                    if(!bookmark){
                      const response = await bookmark_post(id);
                    }else{
                      const response = await remove_bookmark_post(id);
                    }
                    fetchPostDetails(); 
          }   
//       const [postPage, setPostPage] = useState(1);
//       const [hasMorePosts, setHasMorePosts] = useState(true);       
//       const [loadingMorePosts, setLoadingMorePosts] = useState(false);
//       const fetchPosts = async (page = 1, limit = 10) => {

//     try {

//         if (page > 1) {
//             setLoadingMorePosts(true);
//         }

//         const response =
//             await get_posts(page, limit);

//         const newPosts =
//             response?.data?.data?.posts || [];

//         const pagination =
//             response?.data?.data?.pagination;

//         if (page === 1) {

//             setPosts(newPosts);

//         } else {

//             setPosts(prevPosts => [
//                 ...prevPosts,
//                 ...newPosts
//             ]);
//         }

//         setPostPage(page);

//         setHasMorePosts(
//             pagination?.hasMore ?? false
//         );

//     } catch (err) {

//         console.log(err);

//     } finally {

//         setLoadingMorePosts(false);
//     }
// };

  useEffect(() => {

      fetchPost();

      fetchSimilarPosts();

      fetchPostDetails();

  }, [id]);
    
  return (
    <div>
      {post && (
      <div className="w-full min-h-screen bg-white relative  ">
                <SearchNavbar />
                
                <div className="w-full flex gap-2 flex-col items-center justify-center pt-4 pb-15 px-4 ">

                  <div className="w-full  flex flex-col gap-3 items-center ">
                   <div className="min-w-full items-center  flex flex-col gap-3">
                    
                            <div  className="gap-1 w-full lg:max-w-270  min-h-80 p-2 shadow-xl rounded-lg pb-4 lg:flex ">
                                                      
                                                      <img style={{backgroundColor:'#00000066'}} className='w-full   h-65 md:h-100 lg:h-90 max-w-200 rounded-lg' src={getImageUrl(post?.images?.[0])} alt="Post photo" />
                                                       <div className="w-full lg:w-[80%] lg:pt-5 flex flex-col lg:gap-2 gap-1">
                                                       <div className="pl-1 pt-1 w-full flex justify-between text-black">
                                                        <div className=" text-sm font-bold">{post.birdName}</div>
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
                                                        
                                                                                            </div>
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
                                                            <div className={'pl-1 text-[12px] font-semibold text-blue-400 '}>
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
                                                       <div className="text-start w-full rounded-xl  min-h-10 py-3 text-black flex items-center  px-2">
                            
                            <button onClick={()=>navigate(`/creator/${post.creator._id}`)} className="w-full h-full     flex  gap-3 items-center">
                              <img className='w-10 h-10  shadow-2xl object-cover rounded-md' src={getImageUrl(post.creator.profileImage)} alt="Creator profile photo" />
                                <div className="text-sm font-bold text-black  text-start"> 
                                    {post.creator.displayName}
                                </div>
                            </button>
                            <button 
                                        onClick={()=>followHandle()}
                                        className='text-[12px] font-semibold text-white px-2.5 py-0.5 bg-blue-600 rounded-sm'
                                        >
                                           {follow?'Following':'Follow'}
                                      </button>
                      
                      </div>
                      
                                                       </div>

                                                     </div>
                    
                          
                   </div>
                  <div className="w-full  flex flex-col gap-3  ">
                  <Menubar
                      list={{
                          tags: similarMenu?.tags || []
                      }}
                      onSelect={selectSimilarMenu}
                      selectedMenu={selectedSimilarMenu}
                  />
                  {loadingSimilar ? (
                      <MasonrySkeleton count={6} />
                  ) : (
                      <PostCard list={similarPosts} />
                  )}
                  </div>

                  </div>
                </div> 
                
                
      </div>
      )}
      {/* <div className="">Creator account page from user side - {id}</div> */}
    </div>
  )
}

export default Post_user_view
