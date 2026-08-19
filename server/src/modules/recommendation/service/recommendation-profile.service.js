const interactionRepository = require("../repository/interaction.repository");
const recommendationRepository = require("../repository/recommendation.repository");
const interestBuilder = require("./interest-builder.service");

class RecommendationProfileService {

    async rebuild(userId) {

        const interactions =
            await interactionRepository.findByUser(userId);

        const profile =
            interestBuilder.build(interactions);

        return recommendationRepository.upsert(
            userId,
            profile
        );

    }

    async get(userId) {

        return recommendationRepository.findByUser(userId);

    }

}

module.exports = new RecommendationProfileService();