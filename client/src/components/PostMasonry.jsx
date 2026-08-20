import React from "react";

const PostMasonry = ({ children }) => {
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
                {children}
            </div>
        </div>
    );
};

export default PostMasonry;