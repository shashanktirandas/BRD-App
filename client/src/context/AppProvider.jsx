// src/context/AppProvider.jsx

import {
    useEffect,
    useState,
    useRef,
    useCallback
} from "react";
import AppContext from "./AppContext"; 
import { profile_info } from "../services/userService";
import {
    search_all
} from "../services/searchService";
import { creator_getposts, creator_info } from "../services/creatorService";
import { get_bookmark_posts, get_following_accounts, get_posts ,get_personalized_menu} from "../services/homeService";


const AppProvider = ({ children }) => {
    //Token
    const [token, setToken] = useState(
            localStorage.getItem("token") || ""
        );
    // Search
    const [search, setSearch] = useState("");
    // Search Results
    const [searchResults, setSearchResults] = useState({
        feed: []
    });

    const [searchQuery, setSearchQuery] = useState("");

    const [searchLoading, setSearchLoading] = useState(false);

    const [searchError, setSearchError] = useState(null);

    const [searchPagination, setSearchPagination] = useState({
        page: 1,
        limit: 20,
        hasMore: false
    });
    const [searchType, setSearchType] = useState("all");
    //username
    const [username, setUsername] = useState('');

    //email
    const [email, setEmail] = useState('');

    //role
    const [role, setRole] = useState('');

    // Posts
    const [posts, setPosts] = useState([]);
    
    //Posts using
    const [creatorPosts, setCreatorPosts] = useState([]);
    
    // Posts
    const [post, setPost] = useState(null);
    
    const [postPage, setPostPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    
    const loadedPostIdsRef = useRef(new Set());
    const loadingPostsRef = useRef(false);

    // savePosts
    const [savePosts, setSavePosts] = useState([]);

    // Creators
    const [creators, setCreators] = useState(null);

    // following
    const [following, setFollowing] = useState([]);

    // Logged User
    const [user, setUser] = useState({
            username:'',
            email:'',
            role:''
        });

    // Creators
    const [creator, setCreator] = useState({});

    // user trasnformed
    const [transformed, setTransformed] = useState(false);

    // Loading
    const [loading, setLoading] = useState(false);
    
    // Menu
    const [menu, setMenu] = useState(null);
    
    // Selected menu
    const [selectedMenu, setSelectedMenu] = useState({
        type: null,
        value: null
    });

    // Suggestions
    const [searchSuggestions, setSearchSuggestions] = useState(null);
    
    const [modal, setModal] = useState({
            isOpen: false,
            title: "",
            message: "",
            confirmText: "",
            cancelText: "",
            onConfirm: null
        });
    const fetchProfile = async () => {
        try {
            const response = await profile_info();

            const userData = response.data.data;

            setUser(userData);
            setRole(userData.role);

            if (userData.role === "creator") {
                const creatorResponse = await creator_info();
                //console.log(creatorResponse.data.data.creator);
                setCreator(creatorResponse.data.data.creator);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCreatorPosts = async () => {
            try {                
                        const response = await creator_getposts();
                        setCreatorPosts(response?.data?.data?.posts);
                            } catch (err) {
                                console.log(err);
                                setCreatorPosts([]);
                            }
    }; 
    const [loadingSavedPosts, setLoadingSavedPosts] = useState(false);
    const fetchSavedPosts = async () => {

        setLoadingSavedPosts(true);

        try {

            const response = await get_bookmark_posts();

            const bookmarkPosts =
                response?.data?.data?.posts?.map(
                    bookmark => bookmark.post
                ) || [];

            setSavePosts(bookmarkPosts);

        } catch (err) {

            console.log(err);

            setSavePosts([]);

        } finally {

            setLoadingSavedPosts(false);

        }
    };

    const fetchFollowingAccounts = async () => { 
            try {                
                        const response = await get_following_accounts();
                        const accounts = response.data.data.accounts.map(account => account.creator);
                        setFollowing(accounts);
                        //console.log(following);
                        //console.log(response?.data?.data?.accounts || null);
                        console.log(accounts);
                        
                        
                            } catch (err) { 
                                console.log(err);
                                setFollowing([]);
                            }
    };

    const fetchPosts = useCallback(async (
            page = 1,
            limit = 10,
            menuType = selectedMenu.type,
            menuValue = selectedMenu.value
        ) => {
            // console.log(
            //     "FETCH POSTS:",
            //     {
            //         page,
            //         limit,
            //         menuType,
            //         menuValue
            //     }
            // );
        // Prevent duplicate requests
        if (loadingPostsRef.current) {
            return;
        }

        // Don't request another page if there is nothing more
        if (page > 1 && !hasMorePosts) {
            return;
        }

        loadingPostsRef.current = true;

        try {

            if (page > 1) {
                setLoadingMorePosts(true);
            } else {
                setLoadingPosts(true);
            }

            // For page 1, start a fresh feed
            if (page === 1) {
                loadedPostIdsRef.current.clear();
            }

            const excludeIds =
                Array.from(
                    loadedPostIdsRef.current
                );

            // console.log(
            //     "REQUEST PAGE:",
            //     page
            // );

            // console.log(
            //     "EXCLUDE IDS:",
            //     excludeIds.length
            // );

            const response =
                await get_posts(
                    page,
                    limit,
                    excludeIds,
                    menuType,
                    menuValue
                );

            const newPosts =
                response?.data?.data?.posts || [];

            const pagination =
                response?.data?.data?.pagination;
            //console.log("PAGINATION RESPONSE:", pagination);
            // Remove duplicates just in case
            const uniqueNewPosts =
                newPosts.filter(post => {

                    const id =
                        post._id?.toString();

                    if (!id) {
                        return false;
                    }

                    if (
                        loadedPostIdsRef.current.has(id)
                    ) {
                        return false;
                    }

                    loadedPostIdsRef.current.add(id);

                    return true;
                });

            // console.log(
            //     "NEW UNIQUE POSTS:",
            //     uniqueNewPosts.length
            // );

            if (page === 1) {

                setPosts(uniqueNewPosts);

            } else {

                setPosts(prevPosts => [
                    ...prevPosts,
                    ...uniqueNewPosts
                ]);
            }

            setPostPage(page);

            setHasMorePosts(
                pagination?.hasMore ?? false
            );

        } catch (err) {

            console.log(err);

        } finally {
            loadingPostsRef.current = false;
            setLoadingMorePosts(false);
            setLoadingPosts(false);
        }
    }, [selectedMenu, hasMorePosts]);
    
    const fetchMenu = async () => {

        try {

            const response =
                await get_personalized_menu();

            const personalizedMenu =
                response?.data?.data;

            setMenu(personalizedMenu);

            if (personalizedMenu?.tags?.includes("Bird")) {

                setSelectedMenu({
                    type: "tag",
                    value: "Bird"
                });

                await fetchPosts(
                    1,
                    10,
                    "tag",
                    "Bird"
                );
            }

        } catch (err) {

            console.log(err);

            setMenu(null);

            // fallback feed
            await fetchPosts(1, 10);
        }
    };
    const selectMenu = async (type, value) => {

        setSelectedMenu({
            type,
            value
        });

        loadedPostIdsRef.current.clear();

        setPosts([]);
        setPostPage(1);
        setHasMorePosts(true);

        await fetchPosts(
            1,
            10,
            type,
            value
        );
    };
    // ==========================================
    // SEARCH
    // ==========================================

    const performSearch = useCallback(async (
        query,
        page = 1,
        limit = 20,
        type = "all"
    ) => {

        const cleanQuery = query?.trim();
        const cleanType =
            ["all", "posts", "creators", "birds"].includes(type)
                ? type
                : "all";
        if (type !== searchType) {
            setSearchType(type);
        }
        if (!cleanQuery) {

            setSearchQuery("");

            setSearchResults({
                feed: []
            });

            setSearchPagination({
                page: 1,
                limit,
                hasMore: false
            });

            return;
        }


        try {

            setSearchLoading(true);
            setSearchError(null);

            setSearchQuery(cleanQuery);
            setSearchType(cleanType);


            
            const response = await search_all(
                cleanQuery,
                page,
                limit,
                cleanType
            );

            const data =
                response?.data?.data;


            if (!data) {

                throw new Error(
                    "Invalid search response"
                );

            }


            const results =
                data.results || {};


            const pagination =
                data.pagination || {};


            const newFeed =
                Array.isArray(results.feed)
                    ? results.feed
                    : [];


            /*
            |--------------------------------------------------------------------------
            | PAGE 1
            |--------------------------------------------------------------------------
            |
            | Replace the existing feed.
            |
            */

            if (page === 1) {

                setSearchResults({

                    feed: newFeed

                });

            }


            /*
            |--------------------------------------------------------------------------
            | NEXT PAGES
            |--------------------------------------------------------------------------
            |
            | Append new results.
            |
            */

            else {

                setSearchResults(prev => ({

                    feed: [
                        ...(prev.feed || []),
                        ...newFeed
                    ]

                }));

            }


            setSearchPagination({

                page:
                    pagination.page ?? page,

                limit:
                    pagination.limit ?? limit,

                hasMore:
                    pagination.hasMore ?? false

            });


        } catch (error) {

            console.error(
                "SEARCH ERROR:",
                error
            );


            setSearchError(

                error?.response?.data?.message ||

                error?.message ||

                "Search failed"

            );


            /*
            |--------------------------------------------------------------------------
            | Only clear results on first page.
            |--------------------------------------------------------------------------
            */

            if (page === 1) {

                setSearchResults({

                    feed: []

                });

            }

        } finally {

            setSearchLoading(false);

        }

    }, []);
    const loadMoreSearchResults = useCallback(async () => {

        if (searchLoading) {
            return;
        }

        if (!searchPagination.hasMore) {
            return;
        }

        const nextPage =
            searchPagination.page + 1;

        await performSearch(
            searchQuery,
            nextPage,
            searchPagination.limit,
            searchType
        );

    }, [
        searchLoading,
        searchPagination,
        searchQuery,
        searchType,
        performSearch
    ]);
    useEffect(() => {
    if (token) {
        fetchProfile();
        fetchMenu();
    }
}, [token]);
    return (
        <AppContext.Provider
            value={{
                fetchProfile,
                fetchPosts,
                fetchCreatorPosts,
                fetchSavedPosts,
                fetchFollowingAccounts,

                token,
                setToken,

                username,
                setUsername,

                email,
                setEmail,

                role,
                setRole,

                search,
                setSearch,

                searchResults,
                setSearchResults,

                searchQuery,
                setSearchQuery,

                searchLoading,
                searchError,

                searchPagination,

                searchType,
                setSearchType,

                performSearch,

                loadMoreSearchResults,

                posts,
                setPosts,

                postPage,
                hasMorePosts,
                loadingMorePosts,
                setLoadingMorePosts,
                
                loadingPosts,

                creatorPosts,
                setCreatorPosts,

                post,
                setPost,

                savePosts,
                setSavePosts,

                creators,
                setCreators,

                following,
                setFollowing,

                user,
                setUser,

                creator,
                setCreator,

                loading,
                setLoading,

                menu,
                setMenu,

                selectedMenu,
                setSelectedMenu,
                selectMenu,

                searchSuggestions,
                setSearchSuggestions,

                modal,
                setModal,

                transformed,
                setTransformed,

                loadingSavedPosts
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;