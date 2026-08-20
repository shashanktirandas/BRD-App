import React from "react";
import EditCard from "./EditCard";
import PostMasonry from "./PostMasonry";

const CreatorCards = ({ list }) => {

    if (!list?.length) return null;

    return (
        <PostMasonry>
            {list.map((ele) => (
                <div
                    key={ele._id}
                    className="
                        w-full
                        mb-4
                        break-inside-avoid
                    "
                >
                    <EditCard ele={ele} />
                </div>
            ))}
        </PostMasonry>
    );
};

export default CreatorCards;