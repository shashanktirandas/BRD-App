import React, {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import brd_logo from "../img/brd-logo.png";

import {
    useNavigate
} from "react-router-dom";

import {
    get_search_suggestions
} from "../services/searchService";

import SearchSuggestion from "./SearchSuggestion";
import AppContext from "../context/AppContext";


const SearchTextNavbar = () => {

    const {
        searchQuery,
        setSearchQuery
    } = useContext(AppContext);

    const [suggestions, setSuggestions] =
        useState([]);

    const [showSuggestions, setShowSuggestions] =
        useState(false);

    const [loadingSuggestions, setLoadingSuggestions] =
        useState(false);


    const navigate =
        useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const searchContainerRef =
        useRef(null);


    /*
    |--------------------------------------------------------------------------
    | Fetch suggestions
    |--------------------------------------------------------------------------
    */
    
    useEffect(() => {

        const query =
            searchQuery.trim();
        

        if (query.length < 2) {

            setSuggestions([]);

            setShowSuggestions(false);

            return;
        }


        let cancelled = false;


        const timer =
            setTimeout(
                async () => {

                    try {

                        setLoadingSuggestions(
                            true
                        );


                        const response =
                            await get_search_suggestions(
                                query
                            );


                        if (cancelled) {
                            return;
                        }


                        const results =
                            response?.data?.data?.suggestions
                            || [];


                        setSuggestions(
                            results
                        );


                        setShowSuggestions(
                            results.length > 0
                        );


                    } catch (error) {

                        if (!cancelled) {

                            console.error(
                                "Search suggestions error:",
                                error
                            );


                            setSuggestions([]);

                            setShowSuggestions(
                                false
                            );
                        }

                    } finally {

                        if (!cancelled) {

                            setLoadingSuggestions(
                                false
                            );
                        }
                    }

                },
                250
            );


        return () => {

            cancelled = true;

            clearTimeout(timer);

        };

    }, [searchQuery]);


    /*
    |--------------------------------------------------------------------------
    | Full search
    |--------------------------------------------------------------------------
    */

    const handleSearch = () => {

        const query =
            searchQuery.trim();


        if (!query) {
            return;
        }


        setShowSuggestions(
            false
        );


        navigate(
            `/search/q=${encodeURIComponent(query)}`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Suggestion selection
    |--------------------------------------------------------------------------
    */

    const handleSuggestionSelect = (
        suggestion
    ) => {

        const query =
            suggestion?.text?.trim();


        if (!query) {
            return;
        }


        setSearchQuery(
            query
        );


        setShowSuggestions(
            false
        );


        navigate(
            `/search/q=${encodeURIComponent(query)}`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Keyboard
    |--------------------------------------------------------------------------
    */

    const handleKeyDown = (
        event
    ) => {

        if (
            event.key === "Enter"
        ) {

            handleSearch();

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Close suggestions when clicking outside
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const handleClickOutside = (
            event
        ) => {

            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(
                    event.target
                )
            ) {

                setShowSuggestions(
                    false
                );

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    return (

        <div className="">

            <div
                style={{
                    backgroundColor:
                        "#99d66f"
                }}
                className="
                    w-full
                    h-14
                    rounded-b-lg
                    px-3
                    py-2
                    flex
                    justify-center
                    items-center
                    text-black
                "
            >

                <div
                    ref={searchContainerRef}
                    className="
                        w-full
                        h-full
                        bg-white
                        rounded-xl
                        flex
                        p-1
                        px-2
                        max-w-160
                        relative
                    "
                >

                    <input
                        className="
                            w-full
                            h-full
                            text-lg
                            px-3
                            py-1
                            outline-none
                        "
                        ref={inputRef}
                        placeholder="Search for brds..."
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        onFocus={() => {

                            if (
                                suggestions.length > 0
                            ) {

                                setShowSuggestions(
                                    true
                                );

                            }

                        }}
                        type="text"
                    />


                    <button
                        type="button"
                        onClick={
                            handleSearch
                        }
                    >

                        <img
                            style={{
                                backgroundColor:
                                    "#00000000"
                            }}
                            className="
                                w-8
                                h-8
                                object-cover
                            "
                            src={brd_logo}
                            alt=""
                        />

                    </button>


                    {loadingSuggestions &&
                        searchQuery.trim().length >= 2 && (

                            <div
                                className="
                                    absolute
                                    top-full
                                    left-0
                                    right-0
                                    mt-2
                                    z-50
                                    bg-white
                                    rounded-xl
                                    shadow-2xl
                                    px-4
                                    py-3
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Searching...
                            </div>

                        )}


                    {!loadingSuggestions &&
                        showSuggestions && (

                            <SearchSuggestion
                                list={
                                    suggestions
                                }
                                onSelect={
                                    handleSuggestionSelect
                                }
                            />

                        )}

                </div>

            </div>

        </div>

    );

};


export default SearchTextNavbar;