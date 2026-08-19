const BirdPost = require("../../model/BirdPost");

const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const searchBirds = async (query, limit = 20) => {

    if (!query) {
        return [];
    }

    const safeQuery = escapeRegex(query);

    const regex = {
        $regex: safeQuery,
        $options: "i"
    };

    const birds = await BirdPost.aggregate([
        {
            $match: {
                $or: [
                    {
                        birdName: regex
                    },
                    {
                        scientificName: regex
                    }
                ]
            }
        },

        /*
         * A scientific name identifies the bird species much
         * more reliably than the display name.
         *
         * Example:
         *
         * Indian Peafowl
         * Indian Peafowl 44091
         *
         * both become:
         *
         * Pavo cristatus
         */
        {
            $group: {
                _id: "$scientificName",

                birdNames: {
                    $push: "$birdName"
                },

                postCount: {
                    $sum: 1
                }
            }
        },

        /*
         * Pick the shortest bird name as the display name.
         *
         * This prevents values such as:
         * "Indian Peafowl 44091"
         * from becoming the primary search result
         * when "Indian Peafowl" exists.
         */
        {
            $project: {
                _id: 0,

                scientificName: "$_id",

                birdName: {
                    $reduce: {
                        input: "$birdNames",
                        initialValue: "",
                        in: {
                            $cond: [
                                {
                                    $or: [
                                        {
                                            $eq: [
                                                "$$value",
                                                ""
                                            ]
                                        },
                                        {
                                            $lt: [
                                                {
                                                    $strLenCP:
                                                        "$$this"
                                                },
                                                {
                                                    $strLenCP:
                                                        "$$value"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                "$$this",
                                "$$value"
                            ]
                        }
                    }
                },

                postCount: 1
            }
        },

        {
            $sort: {
                postCount: -1,
                birdName: 1
            }
        },

        {
            $limit: limit
        }
    ]);

    return birds;
};

module.exports = searchBirds;