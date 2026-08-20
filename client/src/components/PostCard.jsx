import React from "react";
import Card from "./Card";
import PostMasonry from "./PostMasonry";

const PostCard = ({ list }) => {

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
                    <Card ele={ele} />
                </div>
            ))}
        </PostMasonry>
    );
};

export default PostCard;