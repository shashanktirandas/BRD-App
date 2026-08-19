const interactionService = require("./service/interaction.service");
const recommendationService = require("./service/recommendation.service");
const candidateLoaderService = require("./service/candidate-loader.service");
const scoreEngineService = require("./service/score-engine.service");
const rankEngineService = require("./service/rank-engine.service");
const recommendationProfileService =require("./service/recommendation-profile.service");
const candidateEligibilityService = require("./service/candidate-eligibility.service");
const similarPostService = require("./service/similar-post.service");
module.exports = {
    interactionService,
    recommendationService,
    candidateLoaderService,
    scoreEngineService,
    rankEngineService,
    recommendationProfileService,
    candidateEligibilityService,
    similarPostService
};