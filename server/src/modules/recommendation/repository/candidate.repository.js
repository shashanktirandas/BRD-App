const mongoose = require("mongoose");

const BirdPost =
    require("../../../model/BirdPost");


class CandidateRepository {

    async getLatest({
        limit = 100,
        excludePostIds = [],
        interactedPostIds = [],
        ownProfileId = null
    } = {}) {

        const filter = {};

        const excludedIds = [
            ...excludePostIds,
            ...interactedPostIds
        ];

        if (excludedIds.length > 0) {
            filter._id = {
                $nin: excludedIds
            };
        }

        if (ownProfileId) {

            const ownCreatorId =
                new mongoose.Types.ObjectId(
                    ownProfileId
                );

            filter.creator = {
                $ne: ownCreatorId
            };
        }

        const result = await BirdPost
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .lean();

        // console.log("LATEST FILTER:", filter);
        // console.log("LATEST RESULT COUNT:", result.length);

        return result;
    }


    async getExplorationCandidates({
        limit = 50,
        excludePostIds = [],
        interactedPostIds = [],
        ownProfileId = null
    } = {}) {

        const filter = {};

        const excludedIds = [
            ...excludePostIds,
            ...interactedPostIds
        ];

        if (excludedIds.length > 0) {
            filter._id = {
                $nin: excludedIds
            };
        }

        if (ownProfileId) {

            const ownCreatorId =
                new mongoose.Types.ObjectId(
                    ownProfileId
                );

            filter.creator = {
                $ne: ownCreatorId
            };
        }

        const result = await BirdPost
            .find(filter)
            .sort({ createdAt: 1 })
            .limit(Number(limit))
            .lean();

        //console.log("EXPLORATION FILTER:", filter);
        //console.log("EXPLORATION RESULT COUNT:", result.length);

        return result;
    }


    async getCreatorBalancedCandidates({
        limit = 50,
        excludePostIds = [],
        interactedPostIds = [],
        ownProfileId = null
    } = {}) {

        limit = Number(limit);

        if (!Number.isFinite(limit) || limit <= 0) {
            limit = 50;
        }

        const match = {};

        const excludedIds = [
            ...excludePostIds,
            ...interactedPostIds
        ];

        if (excludedIds.length > 0) {
            match._id = {
                $nin: excludedIds
            };
        }

        if (ownProfileId) {

            const ownCreatorId =
                new mongoose.Types.ObjectId(
                    ownProfileId
                );

            match.creator = {
                $ne: ownCreatorId
            };
        }

        //console.log("BALANCED MATCH:", match);

        return BirdPost.aggregate([

            {
                $match: match
            },

            {
                $sort: {
                    createdAt: -1
                }
            },

            {
                $group: {
                    _id: "$creator",
                    posts: {
                        $push: "$$ROOT"
                    }
                }
            },

            {
                $project: {
                    posts: {
                        $slice: ["$posts", 5]
                    }
                }
            },

            {
                $unwind: "$posts"
            },

            {
                $replaceRoot: {
                    newRoot: "$posts"
                }
            },

            {
                $limit: limit
            }

        ]);
    }
    async getFallbackCandidates({
        limit = 20,
        excludePostIds = [],
        ownProfileId = null
    } = {}) {

        limit = Number(limit);

        if (!Number.isFinite(limit) || limit <= 0) {
            limit = 20;
        }

        const filter = {};

        if (excludePostIds.length > 0) {
            filter._id = {
                $nin: excludePostIds
            };
        }

        if (ownProfileId) {

            const ownCreatorId =
                new mongoose.Types.ObjectId(
                    ownProfileId
                );

            filter.creator = {
                $ne: ownCreatorId
            };
        }

        return BirdPost
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
    }
}


module.exports =
    new CandidateRepository();