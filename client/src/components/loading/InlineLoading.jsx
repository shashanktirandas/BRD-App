import React from "react";

const InlineLoading = ({
    text = "Loading..."
}) => {
    return (
        <div className="
            flex
            items-center
            justify-center
            gap-2
            py-3
            text-sm
            text-gray-400
        ">

            <span
                className="
                    w-4
                    h-4
                    border-2
                    border-gray-300
                    border-t-gray-600
                    rounded-full
                    animate-spin
                "
            />

            <span>
                {text}
            </span>

        </div>
    );
};

export default InlineLoading;