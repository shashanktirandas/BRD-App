import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProfileNavbar from '../components/ProfileNavbar'
import PostCard from '../components/PostCard'
import card_photo from '../img/card-photo2.jpg'
import Menubar from '../components/Menubar'
import AppContext from '../context/AppContext'
import MasonrySkeleton from "../components/loading/MasonrySkeleton";

const Profile_save_posts = () => {
  const [savedMenu, setSavedMenu] = useState({
      tags: []
  });

  const [selectedSavedMenu, setSelectedSavedMenu] = useState({
      type: "tag",
      value: "All"
  });
   const {
        savePosts,
        fetchSavedPosts,
        loadingSavedPosts
    } = useContext(AppContext);
    

  const buildSavedMenu = (posts) => {

      const allTags = posts.flatMap(post =>
          Array.isArray(post.tags)
              ? post.tags
              : []
      );

      const uniqueTags = [
          ...new Set(allTags)
      ];
      
      const orderedTags = [
          "All",
          "Bird",
          ...uniqueTags.filter(
              tag =>
                  tag !== "Bird" &&
                  tag !== "All"
          )
      ];

      setSavedMenu({
          tags: orderedTags.slice(0, 20)
      });

      setSelectedSavedMenu({
          type: "tag",
          value: "All"
      });
  };
   useEffect(()=>{
        fetchSavedPosts();
   },[])
  useEffect(() => {

      if (!savePosts) {
          return;
      }

      buildSavedMenu(savePosts);

  }, [savePosts]);
  const selectSavedMenu = (type, value) => {

      setSelectedSavedMenu({
          type,
          value
      });
  };
  const filteredSavedPosts =
    selectedSavedMenu?.value === "All"
        ? savePosts
        : savePosts.filter(post =>
            Array.isArray(post.tags) &&
            post.tags.includes(
                selectedSavedMenu.value
            )
        );
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
                <ProfileNavbar/>
                <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full  flex flex-col gap-3">
                      <div className="text-sm font-bold text-start px-1 flex gap-1.5 ">
                            <h2 className='text-black'>Saved </h2>
                            <p className='text-gray-400'>& {savePosts? savePosts.length : 0} posts</p>
                      </div>
                      
                      {loadingSavedPosts ? (

    <MasonrySkeleton count={8} />

                        ) : savePosts && savePosts.length > 0 ? (

                            <>
                      <Menubar
                          list={savedMenu}
                          onSelect={selectSavedMenu}
                          selectedMenu={selectedSavedMenu}
                      />

                      <PostCard
                          list={filteredSavedPosts}
                      />
                      </>

                        ) : (

                            <div className="
                                w-full
                                flex
                                flex-col
                                items-center
                                justify-center
                                py-20
                                text-center
                            ">

                                <div className="
                                    w-16
                                    h-16
                                    rounded-2xl
                                    bg-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    text-2xl
                                ">
                                    🔖
                                </div>

                                <h3 className="
                                    mt-4
                                    text-base
                                    font-semibold
                                    text-gray-800
                                ">
                                    No saved posts yet
                                </h3>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-400
                                ">
                                    Posts you bookmark will appear here.
                                </p>

                            </div>

                        )}
                      
                  </div>
              </div>

            </div>
      </div>
    </div>
  )
}

export default Profile_save_posts
