const BirdPost =
    require("../../../model/BirdPost");

class SimilarPostRepository {

    async getSimilarPosts({
        post,
        limit = 20,
        excludePostIds = []
    } = {}) {

        const excludedIds = [
            post._id,
            ...excludePostIds
        ];

        const orConditions = [];

        // Same bird
        if (post.birdName) {
            orConditions.push({
                birdName: post.birdName
            });
        }

        // Same scientific bird name
        if (post.scientificName) {
            orConditions.push({
                scientificName: post.scientificName
            });
        }

        // Shared tags
        if (
            Array.isArray(post.tags) &&
            post.tags.length > 0
        ) {
            orConditions.push({
                tags: {
                    $in: post.tags
                }
            });
        }

        // Same creator
        if (post.creator) {
            orConditions.push({
                creator: post.creator
            });
        }

        if (orConditions.length === 0) {
            return [];
        }

        return BirdPost
            .find({
                _id: {
                    $nin: excludedIds
                },
                $or: orConditions
            })
            .limit(Number(limit))
            .lean();
    }
}

module.exports =
    new SimilarPostRepository();