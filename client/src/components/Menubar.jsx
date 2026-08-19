import React from "react";

const Menubar = ({ list, onSelect = () => {}, selectedMenu }) => {

    const handleWheel = (e) => {

        if (e.deltaY !== 0) {
            e.currentTarget.scrollLeft += e.deltaY;
        }

    };

    const isSelected = (type, value) => {

        return (
            selectedMenu?.type === type &&
            selectedMenu?.value === value
        );

    };

    const buttonClass = (type, value) => {

        return `
            shrink-0
             h-6
            px-3
            text-[13px]
            rounded-md
            transition-all
            duration-200
            ${
                isSelected(type, value)
                    ? "bg-amber-500 text-white "
                    : "bg-[#4fb36b] text-white hover:bg-[#45a960]"
            }
        `;

    };

    return (

        <div
            className="w-full overflow-x-auto overflow-y-hidden"
            onWheel={handleWheel}
        >

            <div
                className="flex items-center gap-3"
                style={{
                    width: "max-content",
                    minWidth: "100%"
                }}
            >

                {/* TAGS */}

                {list?.tags?.map((tag, idx) => (

                    <button
                        key={`tag-${idx}`}
                        onClick={() =>
                            onSelect("tag", tag)
                        }
                        className={buttonClass(
                            "tag",
                            tag
                        )}
                    >
                        {tag}
                    </button>

                ))}


                {/* BIRDS */}

                {list?.birds?.map((bird, idx) => (

                    <button
                        key={`bird-${idx}`}
                        onClick={() =>
                            onSelect("bird", bird)
                        }
                        className={buttonClass(
                            "bird",
                            bird
                        )}
                    >
                        {bird}
                    </button>

                ))}


                {/* CREATORS */}

                {list?.creators?.map((creator, idx) => (

                    <button
                        key={`creator-${idx}`}
                        onClick={() =>
                            onSelect("creator", creator)
                        }
                        className={buttonClass(
                            "creator",
                            creator
                        )}
                    >
                        {creator}
                    </button>

                ))}

            </div>

        </div>

    );

};

export default Menubar;