import React from "react";
import { IoCheckmarkCircle, IoCloudUploadOutline } from "react-icons/io5";

const OperationOverlay = ({ state, image }) => {
    if (!state) return null;

    const steps = [
        {
            key: "preparing",
            label: "Preparing photograph",
        },
        {
            key: "uploading",
            label: "Uploading photograph",
        },
        {
            key: "publishing",
            label: "Creating your post",
        },
        {
            key: "refreshing",
            label: "Updating your feed",
        },
    ];

    const currentIndex = steps.findIndex(
        (step) => step.key === state.step
    );

    const isSuccess = state.step === "success";
    const isError = state.step === "error";

    return (
        <div className="
            fixed inset-0
            z-[9999]
            bg-black/30
            backdrop-blur-md
            flex items-center justify-center
            px-4
        ">
            <div className="
                w-full max-w-sm
                bg-white
                rounded-[28px]
                p-6
                shadow-2xl
                border border-white/70
                animate-[fadeIn_.25s_ease-out]
            ">

                {/* IMAGE */}
                {image && (
                    <div className="
                        w-24 h-24
                        mx-auto
                        mb-5
                        rounded-2xl
                        overflow-hidden
                        shadow-lg
                    ">
                        <img
                            src={image}
                            alt="Uploading"
                            className="
                                w-full
                                h-full
                                object-cover
                            "
                        />
                    </div>
                )}

                {/* ICON */}
                {!image && (
                    <div className="
                        w-16 h-16
                        mx-auto
                        mb-5
                        rounded-2xl
                        bg-blue-50
                        flex items-center justify-center
                    ">
                        {isSuccess ? (
                            <IoCheckmarkCircle className="
                                text-4xl
                                text-green-500
                            " />
                        ) : (
                            <IoCloudUploadOutline className="
                                text-4xl
                                text-blue-500
                            " />
                        )}
                    </div>
                )}

                {/* TITLE */}
                <div className="text-center">

                    <h2 className="
                        text-lg
                        font-bold
                        text-gray-900
                    ">
                        {isSuccess
                            ? "Your post is live!"
                            : isError
                                ? "Something went wrong"
                                : state.message}
                    </h2>

                    <p className="
                        mt-1
                        text-xs
                        text-gray-400
                    ">
                        {isSuccess
                            ? "Your photograph has been published successfully."
                            : isError
                                ? "We couldn't complete your upload."
                                : "Please keep this window open for a moment."}
                    </p>

                </div>

                {/* STEPS */}
                {!isError && (
                    <div className="
                        mt-7
                        space-y-3
                    ">

                        {steps.map((step, index) => {

                            const completed =
                                isSuccess ||
                                index < currentIndex;

                            const active =
                                !isSuccess &&
                                index === currentIndex;

                            return (
                                <div
                                    key={step.key}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    {/* STEP CIRCLE */}
                                    <div className={`
                                        w-7 h-7
                                        rounded-full
                                        shrink-0
                                        flex
                                        items-center
                                        justify-center
                                        text-xs
                                        font-bold
                                        transition-all
                                        duration-300

                                        ${
                                            completed
                                                ? "bg-green-500 text-white"
                                                : active
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-100 text-gray-400"
                                        }
                                    `}>

                                        {completed ? (
                                            <IoCheckmarkCircle className="text-lg" />
                                        ) : (
                                            index + 1
                                        )}

                                    </div>

                                    {/* LABEL */}
                                    <span className={`
                                        text-sm
                                        transition-all
                                        duration-300

                                        ${
                                            completed
                                                ? "text-gray-500"
                                                : active
                                                    ? "font-semibold text-gray-900"
                                                    : "text-gray-300"
                                        }
                                    `}>
                                        {step.label}
                                    </span>

                                    {/* ACTIVE DOT */}
                                    {active && (
                                        <span className="
                                            ml-auto
                                            flex
                                            gap-1
                                        ">
                                            <span className="
                                                w-1.5 h-1.5
                                                rounded-full
                                                bg-blue-500
                                                animate-bounce
                                            "/>

                                            <span className="
                                                w-1.5 h-1.5
                                                rounded-full
                                                bg-blue-500
                                                animate-bounce
                                                [animation-delay:150ms]
                                            "/>

                                            <span className="
                                                w-1.5 h-1.5
                                                rounded-full
                                                bg-blue-500
                                                animate-bounce
                                                [animation-delay:300ms]
                                            "/>
                                        </span>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}

                {/* ERROR */}
                {isError && (
                    <div className="
                        mt-5
                        rounded-xl
                        bg-red-50
                        text-red-600
                        text-sm
                        p-3
                        text-center
                    ">
                        {state.message}
                    </div>
                )}

                {/* PROGRESS BAR */}
                {!isError && !isSuccess && (
                    <div className="
                        mt-7
                        h-1.5
                        bg-gray-100
                        rounded-full
                        overflow-hidden
                    ">
                        <div
                            className="
                                h-full
                                bg-blue-500
                                rounded-full
                                transition-all
                                duration-700
                                ease-out
                            "
                            style={{
                                width:
                                    currentIndex < 0
                                        ? "5%"
                                        : `${((currentIndex + 1) / steps.length) * 100}%`,
                            }}
                        />
                    </div>
                )}

                {/* SUCCESS */}
                {isSuccess && (
                    <div className="
                        mt-6
                        text-center
                        text-xs
                        text-green-600
                        font-semibold"
                    >
                        ✓ Published successfully
                    </div>
                )}

            </div>
        </div>
    );
};

export default OperationOverlay;