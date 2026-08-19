const BirdPost = require("../../model/BirdPost");

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const searchPosts = async (query, limit = 50) => {

    if (!query) {
        return [];
    }

    const safeQuery = escapeRegex(query);

    const regex = {
        $regex: safeQuery,
        $options: "i"
    };

    const posts = await BirdPost.find({
        $or: [
            { birdName: regex },
            { scientificName: regex },
            { description: regex },
            { tags: regex },
            { country: regex },
            { state: regex },
            { city: regex },
            { cameraBrand: regex },
            { cameraModel: regex },
            { lens: regex }
        ]
    })
    .populate({
        path: "creator",
        select: "displayName profileImage user",
        populate: {
            path: "user",
            select: "username"
        }
    })
    .limit(limit)
    .lean();

    return posts;
};

module.exports = searchPosts;
