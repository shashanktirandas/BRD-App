import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import SearchNavbar from '../components/SearchNavbar';
import creator_photo from '../img/creator-photo.png'
import creator_banner from '../img/creator-banner.png'
import no_posts_yet from '../img/no-posts-yet.png'
import { IoMdShare, IoMdShareAlt } from 'react-icons/io';
import { SiMinutemailer } from 'react-icons/si';
import Menubar from '../components/Menubar';
import PostCard from '../components/PostCard';
import card_photo from '../img/card-photo2.jpg'
import AppContext from '../context/AppContext';
import { check_follow, follow_creator, get_creator_followers, get_creator_posts, get_single_creator, unfollow_creator } from '../services/homeService';
import { getImageUrl } from '../utils/imageUrl';
const Creator_user_view = () => {
  const navigate=useNavigate();
  const {id}=useParams();
  const shareCreator = async () => {
      const shareUrl =
          `${window.location.origin}/creator/${id}`;

      try {
          if (navigator.share) {
              await navigator.share({
                  title: creator?.displayName || "Creator",
                  text: "Check out this creator profile.",
                  url: shareUrl
              });
          } else {
              await navigator.clipboard.writeText(shareUrl);
              alert("Creator profile link copied!");
          }
      } catch (err) {
          if (err.name !== "AbortError") {
              console.log("Share failed:", err);
          }
      }
  };
  const {
      creatorPosts,
      setCreatorPosts,
      creator,
      setCreator
  } = useContext(AppContext);
  const [followers, setFollowers] = useState(0);
  const [postsCount, setpostsCount] = useState(0);
  const [follow, setFollow] = useState(false);
  //const [views, setViews] = useState(123)
  const [creatorMenu, setCreatorMenu] = useState({
      tags: []
  });

  const [selectedCreatorMenu, setSelectedCreatorMenu] = useState({
      type: "tag",
      value: "Bird"
  });
    //console.log(creator);
    
    const fetchCreatorDetails = async () =>{
                        try {           
                                const followersResponse = await get_creator_followers(id);
                                setFollowers(followersResponse?.data?.data?.count || 0);
                                const postsResponse = await get_creator_posts(id);
                                setpostsCount(postsResponse?.data?.data?.count || 0);
                                const followResponse = await check_follow(id);
                                //console.log(followResponse);
                                
                                if (followResponse?.data?.data?.follow) {
                                    setFollow(followResponse.data.data.follow);
                                } else {
                                    setFollow(false);
                                }
                        } catch (err) {
                            console.log(err);
                            navigate('/');
                        }
                     
          }
  const fetchCreator = async () => {
        try {
          const response = await get_single_creator(id);
          setCreator(response?.data?.data?.creator || null);
        } catch (err) {
          console.log(err);
          navigate("/");
        }
    };
  const fetchPosts = async () => {

      try {

          const response =
              await get_creator_posts(id);

          const posts =
              response?.data?.data?.posts || [];

          setCreatorPosts(posts);

          buildCreatorMenu(posts);

      } catch (err) {

          console.log(err);

          setCreatorPosts([]);

          setCreatorMenu({
              tags: []
          });
      }
  };
  const buildCreatorMenu = (posts) => {

      const allTags =
          posts.flatMap(post =>
              Array.isArray(post.tags)
                  ? post.tags
                  : []
          );

      const uniqueTags = [
          ...new Set(allTags)
      ];

      const orderedTags = [
          "Bird",
          ...uniqueTags.filter(
              tag => tag !== "Bird"
          )
      ];

      setCreatorMenu({
          tags: orderedTags.slice(0, 20)
      });

      if (uniqueTags.includes("Bird")) {
          setSelectedCreatorMenu({
              type: "tag",
              value: "Bird"
          });
      } else if (orderedTags.length > 0) {
          setSelectedCreatorMenu({
              type: "tag",
              value: orderedTags[0]
          });
      }
  };
  const selectCreatorMenu = (type, value) => {

      setSelectedCreatorMenu({
          type,
          value
      });
  };
  const displayedCreatorPosts =
    selectedCreatorMenu?.value
        ? creatorPosts.filter(post =>
            Array.isArray(post.tags) &&
            post.tags.includes(
                selectedCreatorMenu.value
            )
        )
        : creatorPosts;
  const followHandle= async()=>{
            if(follow){
              const response = await unfollow_creator(id);
            }else{
              const response = await follow_creator(id);
            }
            fetchCreatorDetails();
  }
  
  useEffect(() => {
    fetchCreator();
    fetchPosts();
    fetchCreatorDetails();
  }, [id]);

//console.log(selectedCreator);
  
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
                <SearchNavbar />
                <div className="w-full flex gap-2 flex-col items-center justify-center pt-4 pb-15 px-4 ">

                  <div className="w-full  flex flex-col gap-3 items-center ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
                  <div className="w-full  ">
                  <img className="w-full h-20 lg:h-25  object-cover rounded-xl overflow-hidden" src={getImageUrl(creator.coverImage)} />
                  <div className="w-full   px-4 flex "> 
                            <div className="relative h-full min-w-25">
                              <div className="w-25 h-25  bg-white rounded-sm absolute -top-15 z-10 p-1">
                                <img className="w-full h-full object-cover rounded-sm" src={getImageUrl(creator.profileImage)} />
                              </div> 
                            </div>
                            <div className=" h-full px-3 pt-2 flex flex-col gap-1 items-start ">
                              <div className="text-sm font-bold text-black capitalize">
                                {creator.displayName}
                              </div>
                              <div className="text-[12px] font-semibold text-gray-400">
                                  {followers} followers & {postsCount} posts
                            </div>
                            <div className="flex gap-2">
                                     <button 
                                        onClick={()=>followHandle()}
                                        className='text-[12px] px-2.5 py-0.5 bg-blue-600 rounded-sm'
                                        >
                                           {follow?'Following':'Follow'}
                                      </button>
                                     <button
                                          onClick={shareCreator}
                                          className='text-[12px] px-2.5 py-0.5 bg-gray-200 text-black rounded-sm flex items-center gap-1'
                                      >
                                          <p>Share</p>
                                          <SiMinutemailer className='text-[14px]' />
                                      </button>
                            </div>
                            
                            </div>
                  </div>

                  </div>
                  <button onClick={()=>navigate(`/creator/${creator._id}/bio`)} className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-sm font-semibold text-gray-400">
                    <h1>
                      Bio
                    </h1>
                    <p className='line-clamp-5'>
                      {creator.bio}
                    </p>
                  </button>
                   </div>
                  {/* <div className="w-full  flex flex-col gap-3  ">
                  <Menubar list={menu}/>
                  <PostCard list={creatorPosts}/> 
                  </div> */}
                  {creatorPosts && (
                    <>
                    {creatorPosts.length && (
                          <div 
                          className="w-full  flex flex-col gap-3  ">
                                  <Menubar
                                      list={creatorMenu}
                                      onSelect={selectCreatorMenu}
                                      selectedMenu={selectedCreatorMenu}
                                  />

                                  <PostCard
                                      list={displayedCreatorPosts}
                                  />
                        </div>
                   )
                   }
                   {!creatorPosts.length && (
                          <div 
                          className="w-full lg:w-150 flex flex-col justify-center items-center gap-3  ">
                                  <img style={{backgroundColor:'#00000000'}} className='w-50 lg:w-60 h-50 lg:h-60  rounded-lg' src={no_posts_yet} alt="Post photo" />
                        </div>
                   )
                   }
                    </>
                   )}
                  

                  </div>
                </div>  
      </div>
    </div>
  )
}

export default Creator_user_view
