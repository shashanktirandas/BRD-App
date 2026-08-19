const ScoreInterface =
    require("../interfaces/ScoreInterface");

class FollowedCreatorScore extends ScoreInterface {

    calculate(post, profile, context = {}) {

        if (!post?.creator) {
            return 0;
        }

        const followedCreators =
            Array.isArray(context.followedCreators)
                ? context.followedCreators
                : [];

        const creatorId =
            post.creator._id
                ? post.creator._id.toString()
                : post.creator.toString();

        const isFollowed =
            followedCreators.some(
                id => id.toString() === creatorId
            );

        return isFollowed ? 15 : 0;

    }

}

module.exports = FollowedCreatorScore;