// import React, { useContext, useEffect } from 'react'
// import SearchNavbar from '../components/SearchNavbar'
// import SearchSuggestion from '../components/SearchSuggestion'
// import { Link, useNavigate, useParams } from 'react-router-dom'
// import PostCard from '../components/PostCard'
// import card_photo from '../img/card-photo.jpg' 
// import Menubar from '../components/Menubar'
// import creator_photo from '../img/creator-photo.png'
// import AppContext from '../context/AppContext'

// const Search_result = () => {
//     const { id } = useParams();

//     const urlQuery = id?.startsWith("q=")
//         ? decodeURIComponent(id.substring(2))
//         : decodeURIComponent(id || "");
//     const {
//         searchResults,
//         searchLoading,
//         searchError,
//         performSearch,
//         posts,
//         menu
//     } = useContext(AppContext);
//     useEffect(() => {

//         if (!urlQuery) {
//             return;
//         }

//         performSearch(urlQuery);

//     }, [urlQuery, performSearch]);
//     const postList = [{
//           img: card_photo,
//           title: 'Whispers on the Wing | Eyes on the Horizon',
//           dis: `Took a quiet trip out to the wetlands just before sunrise, waiting for the light to hit the fog just right. After nearly two hours of absolute stillness, this stunning creature landed on a weathered perch just a few yards away.
    
//       Moments like these remind me why I wake up at 4:00 AM—nature doesn't wait for anyone, but when you're patient enough, it lets you in on its secret moments.
    
//       📸 Gear & Settings:
//       Camera: Full Frame Body
//       Lens: 600mm f/4
//       Settings: 1/1600s | f/4.0 | ISO 400
//       Lighting: Natural Golden Hour Light`,
//           tag: '#BirdPhotography #WildlifePhotography #FeatheredFriends #AvianArt #BirdWatching #NatureInFocus'
//         },];
//     const profileList = [{
//           name:'rathika rameshwary wildlife photographer',
//           dis:'124 followers & 30 posts',
//           follow:false
//         },
//         {
//           name:'sathwik pottabathini wildlife photographer',
//           dis:'124 followers & 30 posts',
//           follow:false
//         },];
//         const navigate = useNavigate();
//          const menuList=['ALL','NEW','TRENDY','VIBE','COOL','CRAZY','ALL','NEW','TRENDY','VIBE','COOL','CRAZY','ALL','NEW','TRENDY','VIBE','COOL','CRAZY','ALL','NEW','TRENDY','VIBE','COOL','CRAZY']
//   return (
//     <div>
//       <div className="w-full min-h-screen bg-white relative flex flex-col gap-2 ">
//                 <SearchNavbar value={urlQuery}/>
//                 <div className="w-full px-5 ">
//                  <Menubar list={menu}/>
//                  </div>
//                 <div className="w-full flex gap-2 flex-col justify-center pb-15">
//                       <PostCard list={posts}/>
//                       <div className="w-full flex gap-2 flex-col items-center">
//                         {
//                           profileList.map((ele)=>{
//                             return <button onClick={()=>navigate(`/creator/${ele.name}`)} className="w-78 lg:w-90 min-h-25  bg-white shadow-2xl rounded-lg flex items-center px-4 py-4 flex-nowrap">
                          
//                             <img className='w-20 h-20  shadow-2xl object-cover rounded-md' src={creator_photo} alt="Creator profile photo" />
                         
//                           <div className="w-full h-full   px-3 flex flex-col gap-1 items-start">
//                             <div className="text-sm font-bold text-black  text-start">
//                               {ele.name}
//                             </div>
//                             <div className="text-[12px] font-semibold text-gray-400">
//                               {ele.dis}
//                             </div>
//                             <div className='text-[12px] px-2.5 py-0.5 bg-blue-600 rounded-sm'>{ele.follow? 'Following' : 'Follow'}</div>
//                           </div>
//                         </button>
//                           })
//                         }
                        
//                       </div>
//                 </div>
                
                
                
//       </div>
      
//     </div>
//   )
// }

// export default Search_result


import React, {
    useContext,
    useEffect,
    useRef
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MasonrySkeleton from "../components/loading/MasonrySkeleton";

import SearchNavbar from "../components/SearchNavbar";
import Card from "../components/Card";
import AppContext from "../context/AppContext";
import Menubar from "../components/Menubar";
import SearchMenu from "../components/SearchMenu";
import { getImageUrl } from "../utils/imageUrl";

const Search_result = () => {

    const { id } = useParams();

    const navigate = useNavigate();
    const loadMoreRef = useRef(null);

    // ==========================================
    // SEARCH QUERY FROM URL
    // ==========================================

    const urlQuery = id?.startsWith("q=")
        ? decodeURIComponent(id.substring(2))
        : decodeURIComponent(id || "");


    // ==========================================
    // APP SEARCH STATE
    // ==========================================

    const {
        searchResults,
        searchLoading,
        searchError,
        searchPagination,

        searchType,

        performSearch,
        loadMoreSearchResults
    } = useContext(AppContext);


    // ==========================================
    // RUN SEARCH
    // ==========================================

    useEffect(() => {

        if (!urlQuery?.trim()) {
            return;
        }

        performSearch(urlQuery);

    }, [
        urlQuery,
        performSearch
    ]);


    // ==========================================
    // SAFE RESULTS
    // ==========================================

    const feed =
        searchResults?.feed || [];

    const hasResults =
        feed.length > 0;
    useEffect(() => {

        const element =
            loadMoreRef.current;

        if (!element) {
            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {

                    const firstEntry =
                        entries[0];

                    if (
                        firstEntry.isIntersecting &&
                        searchPagination?.hasMore &&
                        !searchLoading
                    ) {

                        loadMoreSearchResults();

                    }

                },
                {
                    rootMargin: "300px"
                }
            );

        observer.observe(element);

        return () => {

            observer.disconnect();

        };

    }, [
        searchPagination?.hasMore,
        searchLoading,
        loadMoreSearchResults
    ]);

    // ==========================================
    // LOADING
    // ==========================================

    if (searchLoading) {

        return (
            <div className="w-full min-h-screen bg-white">

                <SearchNavbar />

                <div className="w-full px-3 sm:px-5 pt-4">

                    <p className="
                        text-sm
                        text-gray-400
                        px-1
                        mb-2
                    ">
                        Searching
                    </p>

                    <h1 className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-gray-900
                        px-1
                        mb-2
                    ">
                        "{urlQuery}"
                    </h1>

                </div>

                <MasonrySkeleton count={8} />

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (searchError) {

        return (
            <div className="w-full min-h-screen bg-white">

                <SearchNavbar />

                <div className="w-full flex justify-center py-20 px-5">

                    <div className="text-center">

                        <h2 className="text-lg font-bold text-gray-800">
                            Something went wrong
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {searchError}
                        </p>

                    </div>

                </div>

            </div>
        );
    }
   

    return (

        <div className="w-full min-h-screen bg-white">

            {/* ==================================
                SEARCH NAVBAR
            ================================== */}

            <SearchNavbar />

            <div className="w-full px-3 sm:px-5 pt-2">

                <SearchMenu
                    selectedType={searchType}
                    onSelect={(type) => {

                        if (!urlQuery?.trim()) {
                            return;
                        }

                        performSearch(
                            urlQuery,
                            1,
                            20,
                            type
                        );

                    }}
                />

            </div>
            {/* ==================================
                SEARCH HEADER
            ================================== */}

            <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">

                <div className=" mx-2">

                    <p className="
                        text-sm
                        text-gray-400
                    ">
                        Search results
                    </p>

                    <h1 className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-gray-900
                        mt-1
                    ">
                        "{urlQuery}"
                    </h1>

                </div>

            </div>


            {/* ==================================
                NO RESULTS
            ================================== */}

            {!hasResults && (

                <div className="w-full flex justify-center py-20 px-5">

                    <div className="text-center max-w-md">

                        <div className="text-5xl mb-4">
                            🔍
                        </div>

                        <h2 className="text-lg font-bold text-gray-800">
                            No results found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            We couldn't find anything matching "{urlQuery}".
                        </p>

                    </div>

                </div>

            )}


            {/* ==================================
                RESULTS
            ================================== */}

            {/* ==================================
                MIXED SEARCH RESULTS
            ================================== */}

            {hasResults && (

                <div className="w-full px-3 sm:px-5 lg:px-8 pb-20">

                    <div className="w-full mx-auto">

                        <div className="
                                columns-1
                                sm:columns-2
                                lg:columns-3
                                xl:columns-4
                                gap-4
                            ">
   

                            {feed.map((item, index) => {

                                // ==========================================
                                // POST
                                // ==========================================

                                if (item.type === "post") {

                                    return (

                                        <div
                                            key={`post-${item.data?._id || index}`}
                                            className="
                                                w-full
                                                min-w-0
                                                mb-4
                                                break-inside-avoid
                                            "
                                        >
                                            <Card ele={item.data} variant="search" />
                                        </div>

                                    );

                                }


                                // ==========================================
                                // CREATOR
                                // ==========================================

                                if (item.type === "creator") {

                                    const creator =
                                        item.data || {};

                                    const creatorId =
                                        creator?._id;

                                    const username =
                                        creator?.user?.username || "";

                                    const displayName =
                                        creator?.displayName ||
                                        username ||
                                        "Unknown creator";

                                    const profileImage =
                                        creator?.profileImage ||
                                        "/placeholder-profile.png";


                                    return (

                                        <button
                                            key={`creator-${creatorId || index}`}
                                            type="button"
                                            onClick={() => navigate(`/creator/${creatorId}`)}
                                            className="
                                                w-full
                                                mb-4
                                                break-inside-avoid
                                                bg-white
                                                border
                                                border-gray-100
                                                shadow-sm
                                                hover:shadow-lg
                                                rounded-2xl
                                                flex
                                                items-center
                                                gap-4
                                                px-4
                                                py-4
                                                text-left
                                                transition
                                                duration-200
                                            "
                                        >

                                            <img
                                                src={getImageUrl(profileImage)}
                                                alt={displayName}

                                                className="
                                                    w-16
                                                    h-16

                                                    rounded-full
                                                    object-cover
                                                    shrink-0
                                                "
                                            />


                                            <div className="min-w-0 flex-1">

                                                <h3 className="
                                                    text-sm
                                                    sm:text-base
                                                    font-bold
                                                    text-gray-900
                                                    truncate
                                                ">
                                                    {displayName}
                                                </h3>


                                                {username && (

                                                    <p className="
                                                        text-xs
                                                        sm:text-sm
                                                        text-gray-400
                                                        truncate
                                                        mt-0.5
                                                    ">
                                                        @{username}
                                                    </p>

                                                )}


                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    mt-1
                                                ">

                                                    <p className="
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        Photographer / Creator
                                                    </p>

                                                    <span className="
                                                        text-[10px]
                                                        px-2
                                                        py-0.5
                                                        rounded-full
                                                        bg-gray-100
                                                        text-gray-500
                                                    ">
                                                        Suggested
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="
                                                text-gray-400
                                                text-lg
                                                shrink-0
                                            ">
                                                →
                                            </div>

                                        </button>

                                    );

                                }


                                // ==========================================
                                // BIRD
                                // ==========================================

                                if (item.type === "bird") {

                                    const bird =
                                        item.data || {};


                                    return (

                                        <button
                                            key={`bird-${bird?.scientificName || bird?.birdName || index}`}
                                            type="button"
                                            className="
                                                w-full
                                                mb-4
                                                break-inside-avoid
                                                bg-white
                                                border
                                                border-gray-100
                                                shadow-sm
                                                hover:shadow-lg
                                                rounded-2xl
                                                p-5
                                                text-left
                                                transition
                                                duration-200
                                            "
                                        >

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-3
                                            ">

                                                <div>

                                                    <h3 className="
                                                        text-base
                                                        font-bold
                                                        text-gray-900
                                                    ">
                                                        {bird?.birdName}
                                                    </h3>


                                                    {bird?.scientificName && (

                                                        <p className="
                                                            text-sm
                                                            italic
                                                            text-gray-400
                                                            mt-1
                                                        ">
                                                            {bird.scientificName}
                                                        </p>

                                                    )}

                                                </div>


                                                <span className="
                                                    shrink-0
                                                    text-xs
                                                    px-2
                                                    py-1
                                                    rounded-full
                                                    bg-gray-100
                                                    text-gray-500
                                                ">
                                                    Search by bird
                                                </span>

                                            </div>


                                            <div className="
                                                mt-4
                                                text-xs
                                                text-gray-400
                                            ">
                                                {bird?.postCount || 0} posts
                                            </div>

                                        </button>

                                    );

                                }


                                return null;

                            })}

                        </div>

                    </div>

                </div>

            )}

            {hasResults && (

                <div
                    ref={loadMoreRef}
                    className="w-full"
                >

                    {searchLoading && (
                        <MasonrySkeleton count={4} />
                    )}

                    {!searchLoading &&
                        searchPagination?.hasMore && (

                        <div className="
                            w-full
                            flex
                            justify-center
                            py-8
                        ">
                            <p className="
                                text-xs
                                text-gray-400
                            ">
                                Scroll for more
                            </p>
                        </div>

                    )}

                </div>

            )}

        </div>

    );

};


export default Search_result;