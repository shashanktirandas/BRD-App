import React from "react";

const SearchMenu = ({
    selectedType = "all",
    onSelect
}) => {

    const options = [
        {
            value: "all",
            label: "All",
            width: "min-w-[64px]"
        },
        {
            value: "posts",
            label: "Posts",
            width: "min-w-[78px]"
        },
        {
            value: "creators",
            label: "Creators",
            width: "min-w-[92px]"
        },
        {
            value: "birds",
            label: "Birds",
            width: "min-w-[70px]"
        }
    ];


    return (

        <div className="
            w-full
            overflow-x-auto
            overflow-y-hidden
            scrollbar-hide
        ">

            <div className="
                flex
                flex-nowrap
                items-center
                justify-start
                gap-2
                w-max
                pb-1
            ">

                {options.map((option) => {

                    const selected =
                        selectedType === option.value;


                    return (

                        <button
                            key={option.value}
                            type="button"

                            onClick={() => {

                                if (selected) {
                                    return;
                                }

                                onSelect?.(option.value);

                            }}

                            className={`
                                ${option.width}

                                shrink-0
                                box-border

                                px-4
                                py-2

                                rounded-full

                                text-sm
                                font-medium
                                whitespace-nowrap

                                border

                                transition-colors
                                duration-200

                                ${
                                    selected
                                        ? `
                                            bg-[#4fb36b]
                                            text-white
                                            border-[#4fb36b]
                                            shadow-sm
                                        `
                                        : `
                                            bg-white
                                            text-gray-600
                                            border-gray-200
                                            hover:border-[#4fb36b]
                                            hover:text-[#4fb36b]
                                        `
                                }
                            `}
                        >
                            {option.label}
                        </button>

                    );

                })}

            </div>

        </div>

    );

};

export default SearchMenu;