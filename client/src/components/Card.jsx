import React, {
    useEffect,
    useState,
    useRef
} from 'react'

import { CiBookmark, CiHeart } from 'react-icons/ci';
import { FaBookmark, FaHeart, FaRegHeart } from 'react-icons/fa';
import { IoMdBookmark, IoMdHeart } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { FiShare2 } from 'react-icons/fi';
import {
  HeartIcon as OutlineHeart,
  BookmarkIcon as OutlineBookmark,
} from "@heroicons/react/24/outline";

import {
  HeartIcon as SolidHeart,
  BookmarkIcon as SolidBookmark,
} from "@heroicons/react/24/solid";

import {
    bookmark_post,
    check_post_bookmark,
    check_post_like,
    dislike_post,
    like_post,
    remove_bookmark_post,
    record_post_view
} from '../services/homeService';
import { getImageUrl } from '../utils/imageUrl';

const Card = (props) => {

    const isSearchCard =
        props.variant === "search";
    const [showMore, setShowMore] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
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

                await navigator.clipboard.writeText(
                    shareUrl
                );

                alert("Post link copied!");
            }

        } catch (err) {

            if (err.name !== "AbortError") {
                console.log("Share failed:", err);
            }

        }
    };
    const [like, setLike] = useState(false);
    const [bookmark, setBookmark] = useState(false);

    const cardRef = useRef(null);
    const viewedRef = useRef(false);

    const fetchPostDetails = async () =>{
                            try {           
                                    const likeResponse = await check_post_like(props.ele._id);
                                     //console.log(likeResponse.data.data,props.ele);
                                    setLike(likeResponse?.data?.data?.like || false);
                                    const bookmarkResponse = await check_post_bookmark(props.ele._id);
                                    //console.log(bookmarkResponse.data.data);
                                    setBookmark(bookmarkResponse?.data?.data?.bookmark || false);
                            } catch (err) {
                                console.log(err);
                                //navigate('/');
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
    useEffect(() => {

        const element = cardRef.current;

        if (!element) return;

        let visibleStartTime = null;

        const observer = new IntersectionObserver(
            ([entry]) => {

                // Card became at least 50% visible
                if (
                    entry.isIntersecting &&
                    !viewedRef.current
                ) {

                    visibleStartTime = Date.now();

                    // console.log(
                    //     "VIEW TIMER START:",
                    //     props.ele._id
                    // );

                }

                // Card left the 50% visibility area
                else if (
                    !entry.isIntersecting &&
                    visibleStartTime !== null &&
                    !viewedRef.current
                ) {

                    const duration =
                        (
                            Date.now() -
                            visibleStartTime
                        ) / 1000;

                    visibleStartTime = null;

                    // console.log(
                    //     "POST VISIBLE FOR:",
                    //     duration.toFixed(2),
                    //     "seconds"
                    // );

                    // Ignore very fast scrolling
                    if (duration < 1) {

                        // console.log(
                        //     "VIEW ignored:",
                        //     props.ele._id
                        // );

                        return;
                    }

                    viewedRef.current = true;

                    record_post_view(
                        props.ele._id,
                        Number(duration.toFixed(2))
                    )
                        .then(() => {

                            // console.log(
                            //     "VIEW recorded:",
                            //     props.ele._id,
                            //     "duration:",
                            //     duration.toFixed(2),
                            //     "seconds"
                            // );

                        })
                        .catch(error => {

                            console.log(
                                "Failed to record VIEW:",
                                error
                            );

                            // Allow retry if request failed
                            viewedRef.current = false;

                        });
                }
            },
            {
                threshold: 0.5
            }
        );

        observer.observe(element);

        return () => {

            observer.disconnect();

        };

    }, [props.ele._id]);
    // console.log(showMore);
    //console.log(props);
    
  return (
    <div
        className="
        w-full
        min-w-0
        bg-white
        border
        border-gray-100
        shadow-sm
        hover:shadow-lg
        rounded-2xl
        p-2
        pb-4
        transition-all
        duration-200
    "
    >
                               <button
                                    ref={cardRef}
                                    className='gap-1 w-full text-start'
                                    onClick={() => navigate(`/post/${props.ele._id}`)}
                                >
                            <div className="
                                relative
                                w-full
                                min-h-56
                                rounded-lg
                                overflow-hidden
                                bg-gray-100
                            ">

                                {/* IMAGE LOADING STATE */}

                                {!imageLoaded && !imageError && (
                                    <div className="
                                        absolute
                                        inset-0
                                        bg-gray-100
                                        overflow-hidden
                                    ">

                                        {/* Shimmer */}

                                        <div className="
                                            absolute
                                            inset-y-0
                                            -left-1/2
                                            w-1/2
                                            bg-gradient-to-r
                                            from-transparent
                                            via-white/60
                                            to-transparent
                                            animate-[imageShimmer_1.4s_infinite]
                                        " />

                                        {/* Center indicator */}

                                        <div className="
                                            absolute
                                            inset-0
                                            flex
                                            items-center
                                            justify-center
                                        ">

                                            <div className="
                                                w-8
                                                h-8
                                                rounded-full
                                                border-[2px]
                                                border-gray-300
                                                border-t-gray-500
                                                animate-spin
                                            " />

                                        </div>

                                    </div>
                                )}

                                {/* ACTUAL IMAGE */}

                                <img
                                    src={getImageUrl(props.ele.images?.[0])}
                                    alt="Post photo"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageError(true)}
                                    className={`
                                        w-full
                                        h-auto
                                        min-h-56
                                        rounded-lg
                                        block
                                        transition-opacity
                                        duration-500
                                        ${
                                            imageLoaded
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }
                                    `}
                                />

                                {/* IMAGE ERROR */}

                                {imageError && (
                                    <div className="
                                        absolute
                                        inset-0
                                        flex
                                        items-center
                                        justify-center
                                        bg-gray-100
                                        text-xs
                                        text-gray-400
                                    ">
                                        Unable to load image
                                    </div>
                                )}

                            </div>
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
                                  <div className="
                                        pl-1
                                        pr-1
                                        pt-1
                                        flex
                                        flex-wrap
                                        gap-x-2
                                        text-[12px]
                                        font-semibold
                                        text-blue-400
                                        break-words
                                    
                                    ">
                                        {props.ele.tags?.map((tag, index) => (
                                            <span
                                                key={`${tag}-${index}`}
                                                className="break-words"
                                            >
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
                             
                           </div>
  )
}

export default Card
