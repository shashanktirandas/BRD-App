import React from "react";

const ButtonLoading = ({
    text = "Loading...",
    className = "",
}) => {
    return (
        <span
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                ${className}
            `}
        >
            <span
                className="
                    w-4
                    h-4
                    border-2
                    border-current
                    border-t-transparent
                    rounded-full
                    animate-spin
                "
            />

            <span>
                {text}
            </span>
        </span>
    );
};

export default ButtonLoading;