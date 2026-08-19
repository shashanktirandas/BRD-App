class RankEngineService {

    rank(scoredPosts = []) {

        return [...scoredPosts]

            .sort((a, b) => b.total - a.total);

    }

}

module.exports = new RankEngineService();