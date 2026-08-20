import React from "react";

const SkeletonCard = ({ height = "h-64" }) => {
    return (
        <div
            className="
                w-full
                mb-4
                break-inside-avoid
                bg-white
                rounded-2xl
                border
                border-gray-100
                overflow-hidden
                shadow-sm
            "
        >
            {/* IMAGE */}
            <div
                className={`
                    w-full
                    ${height}
                    bg-gray-200
                    animate-pulse
                `}
            />

            {/* CONTENT */}
            <div className="p-4 space-y-3">

                {/* TITLE */}
                <div className="
                    h-4
                    w-3/4
                    bg-gray-200
                    rounded
                    animate-pulse
                " />

                {/* DESCRIPTION */}
                <div className="
                    h-3
                    w-full
                    bg-gray-100
                    rounded
                    animate-pulse
                " />

                <div className="
                    h-3
                    w-5/6
                    bg-gray-100
                    rounded
                    animate-pulse
                " />

                {/* META */}
                <div className="
                    flex
                    gap-2
                    pt-1
                ">
                    <div className="
                        h-3
                        w-16
                        bg-gray-100
                        rounded
                        animate-pulse
                    " />

                    <div className="
                        h-3
                        w-12
                        bg-gray-100
                        rounded
                        animate-pulse
                    " />
                </div>

            </div>
        </div>
    );
};


const CreatorSkeleton = () => {
    return (
        <div
            className="
                w-full
                mb-4
                break-inside-avoid
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-4
                shadow-sm
                animate-pulse
            "
        >
            <div className="
                flex
                items-center
                gap-4
            ">
                <div className="
                    w-14
                    h-14
                    rounded-full
                    bg-gray-200
                    shrink-0
                " />

                <div className="flex-1 space-y-2">
                    <div className="
                        h-4
                        w-32
                        bg-gray-200
                        rounded
                    " />

                    <div className="
                        h-3
                        w-24
                        bg-gray-100
                        rounded
                    " />

                    <div className="
                        h-3
                        w-28
                        bg-gray-100
                        rounded
                    " />
                </div>
            </div>

            <div className="
                mt-4
                h-9
                w-full
                bg-gray-100
                rounded-xl
            " />
        </div>
    );
};


const BirdSkeleton = () => {
    return (
        <div
            className="
                w-full
                mb-4
                break-inside-avoid
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-5
                shadow-sm
                animate-pulse
            "
        >
            <div className="
                h-5
                w-40
                bg-gray-200
                rounded
            " />

            <div className="
                mt-3
                h-3
                w-28
                bg-gray-100
                rounded
            " />

            <div className="
                mt-4
                h-3
                w-24
                bg-gray-100
                rounded
            " />
        </div>
    );
};


const MasonrySkeleton = ({ count = 8 }) => {

    const heights = [
        "h-64",
        "h-80",
        "h-56",
        "h-72",
        "h-96",
        "h-60",
        "h-76",
        "h-68",
    ];

    return (
        <div
            className="
                w-full
                px-3
                sm:px-5
                lg:px-8
                mt-4
                pb-10
            "
        >
            <div
                className="
                    columns-1
                    sm:columns-2
                    lg:columns-3
                    xl:columns-4
                    gap-4
                "
            >
                {Array.from({ length: count }).map((_, index) => {

                    const type = index % 7;

                    return (
                        <React.Fragment key={index}>

                            {type === 2 ? (
                                <CreatorSkeleton />
                            ) : type === 5 ? (
                                <BirdSkeleton />
                            ) : (
                                <SkeletonCard
                                    height={
                                        heights[
                                            index % heights.length
                                        ]
                                    }
                                />
                            )}

                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default MasonrySkeleton;