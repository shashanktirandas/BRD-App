import React, { useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Menubar from '../components/Menubar';
import PostCard from '../components/PostCard';
import AppContext from '../context/AppContext';
import CreatorSlideBar from '../components/CreatorSlideBar';

const Home = () => {

    const {
        menu,
        posts,
        fetchPosts,
        postPage,
        hasMorePosts,
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

                    <PostCard list={posts} />

                    {loadingMorePosts && (
                        <div className="w-full text-center py-6 text-gray-500">
                            Loading more posts...
                        </div>
                    )}

                </div>

                <CreatorSlideBar />

            </div>

        </div>
    );
};

export default Home;