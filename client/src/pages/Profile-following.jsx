import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileNavbar from '../components/ProfileNavbar'
import { MdKeyboardArrowRight, MdOutlineUpdate } from 'react-icons/md'
import Menubar from '../components/Menubar'
import creator_photo from '../img/creator-photo.png'
import AppContext from '../context/AppContext'
import FollowingAccountCard from '../components/FollowingAccountCard'
import { get_creator_posts } from '../services/homeService'

const Profile_following = () => {
  const [followingMenu, setFollowingMenu] = useState({
      tags: ["All"]
  });

  const [selectedFollowingMenu, setSelectedFollowingMenu] = useState({
      type: "tag",
      value: "All"
  });

  const [followingTags, setFollowingTags] = useState({});
  const {
      following,
      fetchFollowingAccounts
  } = useContext(AppContext);
  const navigate=useNavigate(); 
  const buildFollowingMenu = async () => {

      if (!following || following.length === 0) {
          setFollowingMenu({
              tags: ["All"]
          });

          setFollowingTags({});

          return;
      }

      try {

          const results =
              await Promise.all(
                  following.map(async creator => {

                      try {

                          const response =
                              await get_creator_posts(
                                  creator._id
                              );

                          const posts =
                              response?.data?.data?.posts || [];

                          const tags = [
                              ...new Set(
                                  posts.flatMap(post =>
                                      Array.isArray(post.tags)
                                          ? post.tags
                                          : []
                                  )
                              )
                          ];

                          return {
                              creatorId:
                                  creator._id.toString(),

                              tags
                          };

                      } catch (err) {

                          return {
                              creatorId:
                                  creator._id.toString(),

                              tags: []
                          };
                      }

                  })
              );

          const tagMap = {};

          results.forEach(item => {

              tagMap[item.creatorId] =
                  item.tags;

          });

          setFollowingTags(tagMap);

          const allTags = [
              ...new Set(
                  results.flatMap(
                      item => item.tags
                  )
              )
          ];

          const orderedTags = [
              "All",
              "Bird",
              ...allTags.filter(
                  tag =>
                      tag !== "Bird" &&
                      tag !== "All"
              )
          ];

          setFollowingMenu({
              tags: orderedTags.slice(0, 20)
          });

      } catch (err) {

          console.log(
              "FOLLOWING MENU ERROR:",
              err
          );

          setFollowingMenu({
              tags: ["All"]
          });
      }
  };
  useEffect(()=>{
    fetchFollowingAccounts();
  },[])
  useEffect(() => {

      if (!following) {
          return;
      }

      buildFollowingMenu();

  }, [following]);
  const selectFollowingMenu = (type, value) => {

      setSelectedFollowingMenu({
          type,
          value
      });
  };
  const filteredFollowing =
    selectedFollowingMenu?.value === "All"
        ? following
        : following.filter(creator => {

            const creatorId =
                creator._id.toString();

            const tags =
                followingTags[creatorId] || [];

            return tags.includes(
                selectedFollowingMenu.value
            );
        });
  return (
    <div>
      <div className="w-full min-h-screen bg-white relative  ">
            <div  className="h-full border-3 w-full pb-8 flex flex-col gap-3 ">
                <ProfileNavbar/>
                <div className="w-full  flex flex-col gap-3 items-center px-3 ">
                   <div className="w-full lg:w-150 flex flex-col gap-3">
                      <div className="text-sm font-bold text-start px-1 flex gap-1.5 ">
                            <h2 className='text-black'>Following </h2>
                            <p className='text-gray-400'>& {following?following.length:0} Accounts</p>
                      </div>
                      {following.length && (
                        <>
                        <Menubar
                            list={followingMenu}
                            onSelect={selectFollowingMenu}
                            selectedMenu={selectedFollowingMenu}
                        />
                      <div className="flex flex-col gap-2">
                        {
                          filteredFollowing.map((ele, idx) => {
                              return (
                                  <FollowingAccountCard
                                      key={ele._id}
                                      ele={ele}
                                  />
                              );
                          })
                        }
                  </div>
                  </>
                      )}
                      

                  </div>
              </div>

            </div>
      </div>
    </div>
  )
}

export default Profile_following
