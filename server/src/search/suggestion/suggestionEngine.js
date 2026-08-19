const BirdPost =
    require("../../model/BirdPost");

const PhotographerProfile =
    require("../../model/PhotographerProfile");

const User =
    require("../../model/User");

const {
    scoreSuggestion
} = require("./suggestionScorer");


/*
|--------------------------------------------------------------------------
| Limits
|--------------------------------------------------------------------------
*/

const MAX_SUGGESTIONS = 8;

const MAX_PER_TYPE = 5;


/*
|--------------------------------------------------------------------------
| Normalize query
|--------------------------------------------------------------------------
*/

const normalizeQuery = (
    query
) => {

    return String(
        query || ""
    )
        .trim()
        .replace(
            /\s+/g,
            " "
        )
        .toLowerCase();
};

const cleanBirdName = (
    birdName
) => {

    if (!birdName) {
        return birdName;
    }


    return birdName
        .replace(
            /\s+\d+$/,
            ""
        )
        .trim();
};


/*
|--------------------------------------------------------------------------
| Search suggestions
|--------------------------------------------------------------------------
*/

const getSuggestions = async (
    query
) => {

    const normalizedQuery =
        normalizeQuery(query);


    /*
    |--------------------------------------------------------------------------
    | Don't search for tiny queries
    |--------------------------------------------------------------------------
    */

    if (
        normalizedQuery.length < 2
    ) {

        return [];
    }


    /*
    |--------------------------------------------------------------------------
    | Regex
    |--------------------------------------------------------------------------
    */

    const escapedQuery =
        normalizedQuery.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            escapedQuery,
            "i"
        );


    /*
    |--------------------------------------------------------------------------
    | Candidate queries
    |--------------------------------------------------------------------------
    */

    const [
        posts,
        creators
    ] = await Promise.all([

        BirdPost.find({

            $or: [

                {
                    birdName: regex
                },

                {
                    scientificName: regex
                },

                {
                    tags: regex
                }

            ]

        })
            .select(
                "birdName scientificName tags"
            )
            .limit(
                20
            )
            .lean(),


        PhotographerProfile.find({

            $or: [

                {
                    displayName: regex
                },

                {
                    bio: regex
                },

                {
                    specialization: regex
                }

            ]

        })
            .select(
                "displayName specialization user"
            )
            .populate({
                path: "user",
                select: "username"
            })
            .limit(
                20
            )
            .lean()
    ]);


    const suggestions = [];


    /*
    |--------------------------------------------------------------------------
    | Bird suggestions
    |--------------------------------------------------------------------------
    |
    | Important:
    | Multiple posts may use slightly different bird names:
    |
    |   Indian Peafowl
    |   Indian Peafowl 44091
    |
    | But if their scientific name is:
    |
    |   Pavo cristatus
    |
    | they represent the same bird entity.
    |
    | Therefore suggestions are merged using scientificName.
    |
    */

    const birdMap =
        new Map();


    for (
        const post of posts
    ) {

        const birdName =
            cleanBirdName(
                post.birdName?.trim()
            );


        const scientificName =
            post.scientificName?.trim();


        /*
        |--------------------------------------------------------------------------
        | Canonical key
        |--------------------------------------------------------------------------
        */

        const canonicalKey =
            scientificName
                ? scientificName.toLowerCase()
                : birdName?.toLowerCase();


        if (!canonicalKey) {
            continue;
        }


        /*
        |--------------------------------------------------------------------------
        | Score both common and scientific names
        |--------------------------------------------------------------------------
        */

        const birdNameScore =
            birdName
                ? scoreSuggestion({
                    query:
                        normalizedQuery,

                    text:
                        birdName,

                    type:
                        "bird"
                })
                : 0;


        const scientificNameScore =
            scientificName
                ? scoreSuggestion({
                    query:
                        normalizedQuery,

                    text:
                        scientificName,

                    type:
                        "bird"
                })
                : 0;


        const score =
            Math.max(
                birdNameScore,
                scientificNameScore
            );


        /*
        |--------------------------------------------------------------------------
        | Existing canonical bird
        |--------------------------------------------------------------------------
        */

        const existing =
            birdMap.get(
                canonicalKey
            );


        /*
        |--------------------------------------------------------------------------
        | Prefer the most relevant common name
        |--------------------------------------------------------------------------
        */

        if (
    !existing
) {

    birdMap.set(
        canonicalKey,
        {

            text:
                birdName ||
                scientificName,

            type:
                "bird",

            scientificName:
                scientificName ||
                null,

            score,

            birdNameScore,

            scientificNameScore
        }
    );

} else {

    /*
    |--------------------------------------------------------------------------
    | Keep the best score
    |--------------------------------------------------------------------------
    */

    existing.score =
        Math.max(
            existing.score,
            score
        );


    /*
    |--------------------------------------------------------------------------
    | Prefer a clean common name
    |--------------------------------------------------------------------------
    */

    if (
        birdName &&
        birdNameScore >=
            scientificNameScore
    ) {

        existing.text =
            birdName;

    }


    /*
    |--------------------------------------------------------------------------
    | If the scientific name is the
    | strongest match, still keep the
    | canonical common bird name.
    |--------------------------------------------------------------------------
    */

    if (
        scientificNameScore >
        birdNameScore
    ) {

        if (
            existing.text &&
            !existing.text
                .match(/\d+$/)
        ) {

            // Keep existing clean name

        } else if (
            birdName
        ) {

            existing.text =
                birdName;
        }
    }
    }
    }


    suggestions.push(
        ...birdMap.values()
    );


    /*
    |--------------------------------------------------------------------------
    | Creator suggestions
    |--------------------------------------------------------------------------
    */

    const creatorMap =
        new Map();


    for (
        const creator of creators
    ) {

        const username =
            creator.user?.username;


        const displayName =
            creator.displayName;


        if (
            username
        ) {

            const score =
                scoreSuggestion({

                    query:
                        normalizedQuery,

                    text:
                        username,

                    type:
                        "creator"
                });


            const key =
                `creator:${username.toLowerCase()}`;


            creatorMap.set(
                key,
                {

                    text:
                        username,

                    type:
                        "creator",

                    displayName:
                        displayName ||
                        username,

                    score
                }
            );
        }


        if (
            displayName
        ) {

            const score =
                scoreSuggestion({

                    query:
                        normalizedQuery,

                    text:
                        displayName,

                    type:
                        "creator"
                });


            const key =
                `creator:${displayName.toLowerCase()}`;


            const existing =
                creatorMap.get(key);


            if (
                !existing ||
                score >
                existing.score
            ) {

                creatorMap.set(
                    key,
                    {

                        text:
                            displayName,

                        type:
                            "creator",

                        displayName,

                        score
                    }
                );
            }
        }
    }


    suggestions.push(
        ...creatorMap.values()
    );


    /*
    |--------------------------------------------------------------------------
    | Sort
    |--------------------------------------------------------------------------
    */

    /*
    |--------------------------------------------------------------------------
    | Remove weak suggestions
    |--------------------------------------------------------------------------
    |
    | A suggestion must have meaningful relevance.
    |
    */

    const filteredSuggestions =
        suggestions.filter(
            suggestion =>
                suggestion.score >= 30
        );


    /*
    |--------------------------------------------------------------------------
    | Sort
    |--------------------------------------------------------------------------
    */

    filteredSuggestions.sort(
        (a, b) =>
            b.score -
            a.score
    );


    /*
    |--------------------------------------------------------------------------
    | Limit
    |--------------------------------------------------------------------------
    */

    return filteredSuggestions
        .slice(
            0,
            MAX_SUGGESTIONS
        );
};


module.exports = {
    getSuggestions
};