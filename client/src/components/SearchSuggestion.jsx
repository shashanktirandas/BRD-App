import React from "react";
import brd_logo from "../img/brd-logo.png";
import { useNavigate } from "react-router-dom";


const SearchSuggestion = (props) => {

    const navigate = useNavigate();

    const list = props.list || [];


    const handleClick = (suggestion) => {

        if (!suggestion?.text) {
            return;
        }


        navigate(
            `/search/q=${encodeURIComponent(
                suggestion.text
            )}`
        );

    };


    if (!list.length) {
        return null;
    }


    return (

        <div
            className="
                absolute
                top-full
                left-0
                right-0
                mt-2
                z-50
                max-h-[65vh]
                overflow-y-auto
                px-1
                pb-2
            "
        >

            <div className="flex flex-col gap-2">

                {list.map((suggestion, idx) => (

                    <button
                        key={`${suggestion.type}-${suggestion.text}-${idx}`}
                        type="button"
                        onClick={() =>
                            handleClick(suggestion)
                        }
                        className="
                            w-full
                            min-h-14
                            bg-white
                            rounded-xl
                            flex
                            items-center
                            px-3
                            py-2
                            text-left
                            shadow-[0_4px_16px_rgba(0,0,0,0.12)]
                            hover:shadow-[0_6px_20px_rgba(0,0,0,0.16)]
                            hover:bg-gray-50
                            transition-all
                        "
                    >

                        <div
                            className="
                                flex-1
                                min-w-0
                                px-2
                            "
                        >

                            <p
                                className="
                                    text-base
                                    sm:text-lg
                                    text-gray-600
                                    truncate
                                "
                            >
                                {suggestion.text}
                            </p>


                            {suggestion.type === "bird" &&
                                suggestion.scientificName && (

                                    <p
                                        className="
                                            text-xs
                                            sm:text-sm
                                            text-gray-400
                                            italic
                                            truncate
                                        "
                                    >
                                        {suggestion.scientificName}
                                    </p>

                                )}


                            {suggestion.type === "creator" &&
                                suggestion.displayName && (

                                    <p
                                        className="
                                            text-xs
                                            sm:text-sm
                                            text-gray-400
                                            truncate
                                        "
                                    >
                                        {suggestion.displayName}
                                    </p>

                                )}

                        </div>


                        <img
                            src={brd_logo}
                            alt=""
                            className="
                                w-7
                                h-7
                                sm:w-8
                                sm:h-8
                                object-cover
                                shrink-0
                                ml-2
                            "
                        />

                    </button>

                ))}

            </div>

        </div>

    );

};


export default SearchSuggestion;