import React from "react";

const TopProgressBar = ({ loading = false }) => {

    if (!loading) return null;

    return (
        <div
            className="
                fixed
                top-0
                left-0
                right-0
                z-[10000]
                h-1
                overflow-hidden
                pointer-events-none
            "
        >
            <div
                className="
                    h-full
                    w-1/3
                    bg-blue-500
                    rounded-r-full
                    animate-[loadingBar_1.2s_ease-in-out_infinite]
                "
            />
        </div>
    );
};

export default TopProgressBar;