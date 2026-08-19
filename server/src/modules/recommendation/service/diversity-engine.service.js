class DiversityEngineService {

    diversify(posts = []) {

        const creatorCount = new Map();
        const birdCount = new Map();

        return posts
            .map(item => {

                const creatorId =
                    String(item.post.creator);

                const birdName =
                    item.post.birdName || "UNKNOWN";

                // Creator repetition
                const creatorRepeats =
                    creatorCount.get(creatorId) || 0;

                creatorCount.set(
                    creatorId,
                    creatorRepeats + 1
                );

                // Bird repetition
                const birdRepeats =
                    birdCount.get(birdName) || 0;

                birdCount.set(
                    birdName,
                    birdRepeats + 1
                );

                /*
                 * Creator diversity penalty
                 */
                const creatorPenalty =
                    creatorRepeats * 5;

                /*
                 * Bird diversity penalty
                 */
                const birdPenalty =
                    birdRepeats * 3;

                const diversityPenalty =
                    creatorPenalty +
                    birdPenalty;

                return {

                    ...item,

                    total:
                        item.total -
                        diversityPenalty

                };

            })

            .sort(
                (a, b) =>
                    b.total - a.total
            );

    }

}

module.exports =
    new DiversityEngineService();