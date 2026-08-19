const RecommendationWeights =
    require("../config/recommendation.weights");

const InteractionTypes =
    require("../constants/interaction.types");

class InterestBuilderService {

    build(interactions = []) {

        const profile = {

            birds: {},
            creators: {},
            tags: {}

        };

        /*
         * Stateful interactions.
         *
         * We only care about the latest state for:
         *
         * LIKE / UNLIKE
         * BOOKMARK / REMOVE_BOOKMARK
         * FOLLOW / UNFOLLOW
         */

        const postStates = new Map();
        const creatorStates = new Map();

        /*
         * Sort interactions chronologically.
         *
         * This guarantees that the latest interaction
         * determines the current state.
         */

        const sortedInteractions =
            [...interactions].sort(
                (a, b) =>
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
            );

        for (const interaction of sortedInteractions) {

            const type =
                interaction.interactionType;

            /*
             * LIKE / UNLIKE
             */

            if (
                type === InteractionTypes.LIKE ||
                type === InteractionTypes.UNLIKE
            ) {

                const postId =
                    this.getPostId(interaction);

                if (postId) {

                    postStates.set(
                        `LIKE:${postId}`,
                        type === InteractionTypes.LIKE
                    );

                }

                continue;
            }

            /*
             * BOOKMARK / REMOVE_BOOKMARK
             */

            if (
                type === InteractionTypes.BOOKMARK ||
                type === InteractionTypes.REMOVE_BOOKMARK
            ) {

                const postId =
                    this.getPostId(interaction);

                if (postId) {

                    postStates.set(
                        `BOOKMARK:${postId}`,
                        type === InteractionTypes.BOOKMARK
                    );

                }

                continue;
            }

            /*
             * FOLLOW / UNFOLLOW
             */

            if (
                type === InteractionTypes.FOLLOW ||
                type === InteractionTypes.UNFOLLOW
            ) {

                const creatorId =
                    this.getCreatorId(interaction);

                if (creatorId) {

                    creatorStates.set(
                        creatorId,
                        type === InteractionTypes.FOLLOW
                    );

                }

                continue;
            }

            /*
             * Non-stateful interactions.
             *
             * VIEW
             * OPEN
             * COMMENT
             * SEARCH
             * SEARCH_CLICK
             * TAG_CLICK
             * BIRD_CLICK
             * PROFILE_VISIT
             * SHARE
             */

            this.applyInteraction(
                profile,
                interaction,
                sortedInteractions
            );

        }

        /*
         * Apply the final LIKE states.
         */

        for (const [key, isLiked] of postStates) {

            if (!isLiked) {
                continue;
            }

            const postId =
                key.replace("LIKE:", "");

            const interaction =
                this.findLatestInteraction(
                    sortedInteractions,
                    InteractionTypes.LIKE,
                    postId
                );

            if (interaction) {

                this.applyInteraction(
                    profile,
                    interaction
                );

            }

        }

        /*
         * Apply the final BOOKMARK states.
         */

        for (const [key, isBookmarked] of postStates) {

            if (!isBookmarked) {
                continue;
            }

            const postId =
                key.replace("BOOKMARK:", "");

            const interaction =
                this.findLatestInteraction(
                    sortedInteractions,
                    InteractionTypes.BOOKMARK,
                    postId
                );

            if (interaction) {

                this.applyInteraction(
                    profile,
                    interaction
                );

            }

        }

        /*
         * FOLLOW is creator-level.
         */

        for (const [creatorId, isFollowing] of creatorStates) {

            if (!isFollowing) {
                continue;
            }

            const interaction =
                this.findLatestFollowInteraction(
                    sortedInteractions,
                    creatorId
                );

            if (interaction) {

                this.applyCreatorInteraction(
                    profile,
                    interaction
                );

            }

        }

        return {

            birds: profile.birds,

            creators: profile.creators,

            tags: profile.tags,

            locations: {},

            cameras: {},

            lastCalculatedAt: new Date()

        };

    }


    getPostId(interaction) {

        if (!interaction?.post) {
            return null;
        }

        if (interaction.post._id) {
            return interaction.post._id.toString();
        }

        return interaction.post.toString();

    }


    getCreatorId(interaction) {

        if (!interaction?.creator) {
            return null;
        }

        if (interaction.creator._id) {
            return interaction.creator._id.toString();
        }

        return interaction.creator.toString();

    }


    findLatestInteraction(
        interactions,
        type,
        postId
    ) {

        for (let i = interactions.length - 1; i >= 0; i--) {

            const interaction =
                interactions[i];

            if (
                interaction.interactionType !== type
            ) {
                continue;
            }

            if (
                this.getPostId(interaction) === postId
            ) {

                return interaction;

            }

        }

        return null;

    }


    findLatestFollowInteraction(
        interactions,
        creatorId
    ) {

        for (let i = interactions.length - 1; i >= 0; i--) {

            const interaction =
                interactions[i];

            if (
                interaction.interactionType !==
                    InteractionTypes.FOLLOW &&
                interaction.interactionType !==
                    InteractionTypes.UNFOLLOW
            ) {
                continue;
            }

            if (
                this.getCreatorId(interaction) ===
                creatorId
            ) {

                return interaction;

            }

        }

        return null;

    }


    applyCreatorInteraction(
        profile,
        interaction
    ) {

        const weight =
            RecommendationWeights.interaction[
                interaction.interactionType
            ] ?? 0;

        const creatorId =
            this.getCreatorId(interaction);

        if (!creatorId) {
            return;
        }

        profile.creators[creatorId] =
            (profile.creators[creatorId] || 0) +
            weight;

    }
    getInteractionWeight(interaction) {

        const type =
            interaction.interactionType;

        // Normal interactions
        if (type !== InteractionTypes.VIEW) {

            return (
                RecommendationWeights.interaction[type] ?? 0
            );
        }

        const duration =
            Number(interaction.duration) || 0;

        if (duration < 1) {
            return 0;
        }

        if (duration <= 2) {
            return 1;
        }

        if (duration <= 5) {
            return 2;
        }

        if (duration <= 10) {
            return 3;
        }

        if (duration <= 20) {
            return 5;
        }

        return 7;
    }
    getViewWeight(interaction, interactions) {

        const postId =
            this.getPostId(interaction);

        if (!postId) {
            return 0;
        }

        const previousViews =
            interactions.filter(item =>
                item.interactionType === InteractionTypes.VIEW &&
                this.getPostId(item) === postId &&
                new Date(item.createdAt) <
                    new Date(interaction.createdAt)
            ).length;

        const durationWeight =
            this.getViewDurationWeight(
                interaction.duration
            );

        if (previousViews === 0) {
            return durationWeight;
        }

        if (previousViews === 1) {
            return durationWeight * 0.5;
        }

        if (previousViews === 2) {
            return durationWeight * 0.25;
        }

        return 0;
    }
    getViewDurationWeight(duration) {

        duration = Number(duration) || 0;

        if (duration < 1) return 0;
        if (duration <= 2) return 1;
        if (duration <= 5) return 2;
        if (duration <= 10) return 3;
        if (duration <= 20) return 5;

        return 7;
    }
    applyInteraction(
        profile,
        interaction,
        allInteractions = []
    ) {

        let weight;

        if (
            interaction.interactionType ===
            InteractionTypes.VIEW
        ) {

            weight =
                this.getViewWeight(
                    interaction,
                    allInteractions
                );

        } else {

            weight =
                this.getInteractionWeight(
                    interaction
                );
        }

        if (!weight) {
            return;
        }

        /*
         * Bird interest
         */

        if (interaction.post?.birdName) {

            const bird =
                interaction.post.birdName;

            profile.birds[bird] =
                (profile.birds[bird] || 0) +
                weight;

        }

        /*
         * Creator interest
         */

        const creatorId =
            this.getCreatorId(interaction);

        if (creatorId) {

            profile.creators[creatorId] =
                (profile.creators[creatorId] || 0) +
                weight;

        }
        
        /*
         * Tag interest
         */

        if (interaction.post?.tags?.length) {

            for (
                const tag of interaction.post.tags
            ) {

                profile.tags[tag] =
                    (profile.tags[tag] || 0) +
                    weight;

            }

        }

    }

}

module.exports = new InterestBuilderService();