import React, { useContext, useEffect, useState } from 'react'
import SearchNavbar from '../components/SearchNavbar'
import creator_photo from '../img/creator-photo.png'
import creator_banner from '../img/creator-banner.png'
import no_posts_yet from '../img/no-posts-yet.png'
import AppContext from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'
import { SiMinutemailer } from 'react-icons/si'
import Menubar from '../components/Menubar'
import PostCard from '../components/PostCard'
import ProfileNavbar from '../components/ProfileNavbar'
import { FiEdit } from 'react-icons/fi'
import CreatorCards from '../components/CreatorCards'
import { creator_getposts } from '../services/creatorService'
import { get_creator_followers, get_creator_posts } from '../services/homeService'
import { getImageUrl } from '../utils/imageUrl'

const Creator = () => {
  const {
      creator,
      creatorPosts,
      fetchCreatorPosts,
      fetchProfile
  } = useContext(AppContext);
  const navigate=useNavigate();
  const shareCreator = async () => {
      const shareUrl =
          `${window.location.origin}/creator/${creator._id}`;

      try {
          if (navigator.share) {
              await navigator.share({
                  title: creator.displayName,
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
  const [followers, setFollowers] = useState(0);
  const [postsCount, setpostsCount] = useState(0);
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
                              const followersResponse = await get_creator_followers(creator._id);
                              //console.log(followersResponse.data.data.count);
                              setFollowers(followersResponse?.data?.data?.count || 0);
                              const postsResponse = await get_creator_posts(creator._id);
                              setpostsCount(postsResponse?.data?.data?.count || 0);
                              //console.log(creatorPosts);
                              
                      } catch (err) {
                          console.log(err);
                          navigate('/creator');
                      }
                   
        }
  
  const buildCreatorMenu = (posts) => {

      const allTags = posts.flatMap(post =>
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

      const finalTags =
          orderedTags
              .filter(tag => uniqueTags.includes(tag))
              .slice(0, 20);

      setCreatorMenu({
          tags: finalTags
      });

      if (finalTags.length > 0) {

          setSelectedCreatorMenu({
              type: "tag",
              value: finalTags.includes("Bird")
                  ? "Bird"
                  : finalTags[0]
          });

      }
  };

  useEffect(() => {

      fetchProfile();

      fetchCreatorPosts();

  }, []);
  useEffect(() => {

      if (!creatorPosts) return;

      buildCreatorMenu(creatorPosts);

  }, [creatorPosts]);
  const selectCreatorMenu = (type, value) => {

      setSelectedCreatorMenu({
          type,
          value
      });
  };
  const filteredCreatorPosts =
    selectedCreatorMenu?.value
        ? creatorPosts.filter(post =>
            Array.isArray(post.tags) &&
            post.tags.includes(
                selectedCreatorMenu.value
            )
        )
        : creatorPosts;

    useEffect(() => {
        if (!creator?._id) return;

        fetchCreatorDetails();
    }, [creator._id]);
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
                <ProfileNavbar />
                <div className="w-full flex gap-2 flex-col items-center justify-center pt-4 pb-15 px-4 ">

                  <div className="w-full  flex flex-col gap-3 items-center ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
                  <div className="w-full  ">
                  <img className="w-full h-20 lg:h-25  object-cover rounded-xl overflow-h0den" src={getImageUrl(creator.coverImage)} />
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
                                  {followers} followers  & {postsCount} posts
                            </div>
                            <div className="flex gap-2">
                                     <button
                                        onClick={shareCreator}
                                        className='text-[12px] px-2.5 py-0.5 bg-blue-600 text-white rounded-sm flex items-center gap-1'
                                    >
                                        <p>Share</p>
                                        <SiMinutemailer className='text-[14px]' />
                                    </button>
                                      <button onClick={()=>navigate(`/edit-creator/${creator.displayName}`)} className='text-[12px] px-2.5 py-0.5 bg-gray-200 text-black rounded-sm flex items-center gap-1'> 
                                                        <p>Edit</p>
                                                        <FiEdit  className='text-[12px]' />
                                      </button>
                            </div>
                            
                            </div>
                  </div>

                  </div>
                  <button onClick={()=>navigate(`/creator/${creator.displayName}/bio`)} className="text-start w-full rounded-xl bg-gray-100 min-h-10 px-4 py-3 text-sm font-semibold text-gray-400">
                    <h1>
                      Bio
                    </h1>
                    <p className='line-clamp-5'>
                      {creator.bio}
                      </p>
                  </button>
                   </div>
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
                                  <CreatorCards
                                      list={filteredCreatorPosts}
                                  />
                        </div>
                   )
                   }
                   {!creatorPosts.length && (
                          <div 
                          className="w-full lg:w-150 flex flex-col justify-center items-center gap-3  ">
                            <Link to={'/upload'}>
                                  <img style={{backgroundColor:'#00000000'}} className='w-50 lg:w-60 h-50 lg:h-60  rounded-lg' src={no_posts_yet} alt="Post photo" />
                            </Link>
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

export default Creator
