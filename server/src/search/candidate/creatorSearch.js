const User = require("../../model/User");
const PhotographerProfile = require("../../model/PhotographerProfile");

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const searchCreators = async (query, limit = 50) => {

    if (!query) {
        return [];
    }

    const safeQuery = escapeRegex(query);

    const regex = {
        $regex: safeQuery,
        $options: "i"
    };

    // Find usernames matching the search query.
    const users = await User.find({
        username: regex
    })
    .select("_id")
    .lean();

    const userIds = users.map(user => user._id);

    const creators = await PhotographerProfile.find({
        $or: [
            { displayName: regex },
            { bio: regex },
            { country: regex },
            { state: regex },
            { city: regex },
            { experience: regex },
            { cameraBrand: regex },
            { cameraModel: regex },
            { mainLens: regex },
            { zoomLens: regex },
            { specialization: regex },
            { user: { $in: userIds } }
        ]
    })
    .populate({
        path: "user",
        select: "username"
    })
    .limit(limit)
    .lean();

    return creators;
};

module.exports = searchCreators;