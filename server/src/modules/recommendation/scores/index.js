const BirdScore = require("./bird.score");
const CreatorScore = require("./creator.score");
const TagScore = require("./tag.score");
const FreshnessScore = require("./freshness.score");
const FollowedCreatorScore = require("./FollowedCreatorScore");
const ExplorationBonus = require("./exploration.bonus");
module.exports = [

    new BirdScore(),

    new CreatorScore(),

    new TagScore(),

    new FreshnessScore(),

    new FollowedCreatorScore(),

    new ExplorationBonus()

];