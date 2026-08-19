const mongoose = require("mongoose");

const UserInteraction = require(
    "../modules/recommendation/model/UserInteraction"
);

const InteractionTypes = require(
    "../modules/recommendation/constants/interaction.types"
);


/*
|--------------------------------------------------------------------------
| Engagement weights
|--------------------------------------------------------------------------
|
| These are SEARCH-specific weights.
|
| We deliberately keep them much smaller than
| search relevance and personalization.
|
*/

const ENGAGEMENT_WEIGHTS = {

    LIKE: 1.0,

    BOOKMARK: 1.5,

    COMMENT: 1.25,

    SHARE: 1.5,

    VIEW: 0.05,

    OPEN: 0.1
};


/*
|--------------------------------------------------------------------------
| Maximum contribution to search ranking
|--------------------------------------------------------------------------
*/

const MAX_ENGAGEMENT_BOOST = 15;


/*
|--------------------------------------------------------------------------
| Get engagement counts for posts
|--------------------------------------------------------------------------
*/

const getPostEngagement = async (
    postIds
) => {

    if (
        !Array.isArray(postIds) ||
        postIds.length === 0
    ) {
        return new Map();
    }


    const objectIds =
        postIds.map(id => id.toString());


    const interactions =
        await UserInteraction.aggregate([

            {
                $match: {

                    post: {
                        $in: objectIds.map(
                            id =>
                                new mongoose.Types.ObjectId(id)
                        )
                    },

                    interactionType: {
                        $in: [
                            InteractionTypes.LIKE,
                            InteractionTypes.BOOKMARK,
                            InteractionTypes.COMMENT,
                            InteractionTypes.SHARE,
                            InteractionTypes.VIEW,
                            InteractionTypes.OPEN
                        ]
                    }
                }
            },

            {
                $group: {

                    _id: {
                        post: "$post",
                        type: "$interactionType"
                    },

                    count: {
                        $sum: 1
                    }
                }
            }
        ]);


    const result = new Map();


    for (const item of interactions) {

        const postId =
            item._id.post.toString();

        const type =
            item._id.type;

        if (!result.has(postId)) {

            result.set(
                postId,
                {
                    likes: 0,
                    bookmarks: 0,
                    comments: 0,
                    shares: 0,
                    views: 0,
                    opens: 0
                }
            );
        }


        const stats =
            result.get(postId);


        if (
            type === InteractionTypes.LIKE
        ) {
            stats.likes =
                item.count;
        }


        if (
            type === InteractionTypes.BOOKMARK
        ) {
            stats.bookmarks =
                item.count;
        }


        if (
            type === InteractionTypes.COMMENT
        ) {
            stats.comments =
                item.count;
        }


        if (
            type === InteractionTypes.SHARE
        ) {
            stats.shares =
                item.count;
        }


        if (
            type === InteractionTypes.VIEW
        ) {
            stats.views =
                item.count;
        }


        if (
            type === InteractionTypes.OPEN
        ) {
            stats.opens =
                item.count;
        }
    }


    return result;
};


/*
|--------------------------------------------------------------------------
| Calculate engagement boost
|--------------------------------------------------------------------------
*/

const calculateEngagementBoost = (
    engagement
) => {

    if (!engagement) {
        return 0;
    }


    /*
     * Logarithmic scaling prevents a viral post
     * from completely dominating search.
     */

    const likeScore =
        Math.log1p(
            engagement.likes
        ) *
        ENGAGEMENT_WEIGHTS.LIKE;


    const bookmarkScore =
        Math.log1p(
            engagement.bookmarks
        ) *
        ENGAGEMENT_WEIGHTS.BOOKMARK;


    const commentScore =
        Math.log1p(
            engagement.comments
        ) *
        ENGAGEMENT_WEIGHTS.COMMENT;


    const shareScore =
        Math.log1p(
            engagement.shares
        ) *
        ENGAGEMENT_WEIGHTS.SHARE;


    const viewScore =
        Math.log1p(
            engagement.views
        ) *
        ENGAGEMENT_WEIGHTS.VIEW;


    const openScore =
        Math.log1p(
            engagement.opens
        ) *
        ENGAGEMENT_WEIGHTS.OPEN;


    const rawScore =
        likeScore +
        bookmarkScore +
        commentScore +
        shareScore +
        viewScore +
        openScore;


    return Math.min(
        Math.round(
            rawScore * 100
        ) / 100,

        MAX_ENGAGEMENT_BOOST
    );
};


module.exports = {

    getPostEngagement,

    calculateEngagementBoost
};