const ScoreInterface =
    require("../interfaces/ScoreInterface");

const exposureConfig =
    require("../config/exposure.config");

const InteractionTypes =
    require("../constants/interaction.types");

class ExposurePenalty extends ScoreInterface {

    calculate(post, context = {}) {

        if (!post?._id) {
            return 1;
        }

        const interactions =
            Array.isArray(context.interactions)
                ? context.interactions
                : [];

        const postId =
            post._id.toString();

        const postInteractions =
            interactions.filter(interaction => {

                if (!interaction?.post) {
                    return false;
                }

                const interactionPostId =
                    interaction.post._id
                        ? interaction.post._id.toString()
                        : interaction.post.toString();

                return interactionPostId === postId;

            });

        if (postInteractions.length === 0) {
            return exposureConfig.multipliers.NONE;
        }

        const state =
            this.resolveExposureState(
                postInteractions
            );

        return this.getMultiplier(state);

    }


    resolveExposureState(interactions) {

        let liked = false;
        let bookmarked = false;

        let hasView = false;
        let hasOpen = false;
        let hasComment = false;

        const sorted =
            [...interactions].sort(
                (a, b) =>
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
            );

        for (const interaction of sorted) {

            switch (interaction.interactionType) {

                case InteractionTypes.LIKE:
                    liked = true;
                    break;

                case InteractionTypes.UNLIKE:
                    liked = false;
                    break;

                case InteractionTypes.BOOKMARK:
                    bookmarked = true;
                    break;

                case InteractionTypes.REMOVE_BOOKMARK:
                    bookmarked = false;
                    break;

                case InteractionTypes.VIEW:
                    hasView = true;
                    break;

                case InteractionTypes.OPEN:
                    hasOpen = true;
                    break;

                case InteractionTypes.COMMENT:
                    hasComment = true;
                    break;

                default:
                    break;

            }

        }

        /*
         * Explicit saved/liked state has stronger
         * exposure demotion than simple viewing.
         */

        if (bookmarked) {
            return "BOOKMARKED";
        }

        if (liked) {
            return "LIKED";
        }

        if (hasComment) {
            return "COMMENTED";
        }

        if (hasOpen) {
            return "OPENED";
        }

        if (hasView) {
            return "VIEWED";
        }

        return "NONE";

    }


    getMultiplier(state) {

        return (
            exposureConfig.multipliers[state] ??
            exposureConfig.defaultMultiplier
        );

    }

}

module.exports = ExposurePenalty;