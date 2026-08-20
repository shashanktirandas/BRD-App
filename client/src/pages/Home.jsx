import React, { useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Menubar from '../components/Menubar';
import PostCard from '../components/PostCard';
import AppContext from '../context/AppContext';
import CreatorSlideBar from '../components/CreatorSlideBar';
import MasonrySkeleton from "../components/loading/MasonrySkeleton";

const Home = () => {

    const {
        menu,
        posts,
        fetchPosts,
        postPage,
        hasMorePosts,
        loadingPosts,
        loadingMorePosts,
        selectMenu,
        selectedMenu
    } = useContext(AppContext);

    useEffect(() => {

        const handleScroll = () => {

            const scrollPosition =
                window.innerHeight + window.scrollY;

            const pageHeight =
                document.documentElement.scrollHeight;

            if (
                scrollPosition >= pageHeight - 500 &&
                hasMorePosts &&
                !loadingMorePosts
            ) {

                // console.log("🔥 LOAD MORE TRIGGERED", {
                //     nextPage: postPage + 1,
                //     hasMorePosts,
                //     loadingMorePosts
                // });

                fetchPosts(
                    postPage + 1,
                    10,
                    selectedMenu?.type,
                    selectedMenu?.value
                );
            }
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };

    }, [
        postPage,
        hasMorePosts,
        loadingMorePosts,
        selectedMenu,
        fetchPosts
    ]);
    
    // useEffect(() => {

    //     const handleScroll = () => {

    //         console.log("🔥 WINDOW SCROLL");

    //     };

    //     window.addEventListener("scroll", handleScroll);

    //     return () => {
    //         window.removeEventListener("scroll", handleScroll);
    //     };

    // }, []);

    // Infinite scroll
    // useEffect(() => {

    //     const handleScroll = () => {

    //         const scrollPosition =
    //             window.innerHeight + window.scrollY;

    //         const pageHeight =
    //             document.documentElement.scrollHeight;

    //         if (
    //             scrollPosition >= pageHeight - 500 &&
    //             hasMorePosts &&
    //             !loadingMorePosts
    //         ) {
    //             fetchPosts(postPage + 1, 10);
    //         }
    //     };


    //     window.addEventListener(
    //         "scroll",
    //         handleScroll
    //     );


    //     return () => {

    //         window.removeEventListener(
    //             "scroll",
    //             handleScroll
    //         );

    //     };

    // }, [
    //     postPage,
    //     hasMorePosts,
    //     loadingMorePosts,
    //     fetchPosts
    // ]);


    return (
        <div>

            <div className="w-full min-h-screen bg-white relative">

                <div className="h-full border-3 w-full pb-8 flex flex-col gap-2">

                    <Navbar />

                    <div className="w-full px-5 text-black">
                        <Menubar
                            list={menu}
                            onSelect={selectMenu}
                            selectedMenu={selectedMenu}
                        />
                    </div>

                    {/* INITIAL FEED LOADING */}

                    {loadingPosts ? (
                        <MasonrySkeleton count={8} />
                    ) : (
                        <PostCard list={posts} />
                    )}


                    {/* LOAD MORE */}

                    {loadingMorePosts && (
                        <MasonrySkeleton count={4} />
                    )}

                </div>

                <CreatorSlideBar />

            </div>

        </div>
    );
};

export default Home;