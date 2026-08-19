const interactionRepository = require("../repository/interaction.repository");
const logger = require("../../../utils/logger");
const recommendationProfileService = require("./recommendation-profile.service");

class InteractionService {

    async record({
        userId,
        post = null,
        creator = null,
        interactionType,
        searchQuery = null,
        duration = 0,
        metadata = {}
    }) {

        try {

            const interaction =
                await interactionRepository.create({
                    user: userId,
                    post: post?._id ?? null,
                    creator: creator ?? post?.creator ?? null,
                    searchQuery,
                    duration,
                    interactionType,
                    metadata
                });

            await recommendationProfileService.rebuild(userId);

            return interaction;

        } catch (error) {

            logger.error({
                event: "Recommendation Interaction Failed",
                interactionType,
                error: error.message
            });

            return null;

        }

    }

}

module.exports = new InteractionService();