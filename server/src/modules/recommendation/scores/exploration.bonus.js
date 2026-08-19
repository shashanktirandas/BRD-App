const ScoreInterface =
    require("../interfaces/ScoreInterface");

class ExplorationBonus extends ScoreInterface {

    calculate(post, profile) {

        let matched = false;

        // Check bird interest
        if (
            post?.birdName &&
            profile?.birds?.[post.birdName]
        ) {
            matched = true;
        }

        // Check creator interest
        const creatorId =
            post?.creator?.toString();

        if (
            creatorId &&
            profile?.creators?.[creatorId]
        ) {
            matched = true;
        }

        // Check tag interest
        if (
            Array.isArray(post?.tags)
        ) {

            matched =
                post.tags.some(
                    tag =>
                        profile?.tags?.[tag]
                ) || matched;
        }

        /*
         * If the post has no known
         * connection with the user,
         * give it exploration bonus.
         */

        if (!matched) {
            return 1;
        }

        return 0;
    }

}

module.exports = ExplorationBonus;