const normalizeText = (value) => {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .toLowerCase()
        .trim();
};

const scoreField = (value, query, weights) => {

    const text = normalizeText(value);
    const search = normalizeText(query);

    if (!text || !search) {
        return 0;
    }

    // Exact match
    if (text === search) {
        return weights.exact;
    }

    // Starts with query
    if (text.startsWith(search)) {
        return weights.startsWith;
    }

    // Contains complete query
    if (text.includes(search)) {
        return weights.contains;
    }

    // Individual word matches
    const queryWords = search.split(/\s+/);
    const matchedWords = queryWords.filter(word =>
        text.includes(word)
    );

    if (matchedWords.length === 0) {
        return 0;
    }

    const wordMatchRatio =
        matchedWords.length / queryWords.length;

    return weights.wordMatch * wordMatchRatio;
};

const scoreArrayField = (values, query, weights) => {

    if (!Array.isArray(values)) {
        return 0;
    }

    return Math.max(
        0,
        ...values.map(value =>
            scoreField(value, query, weights)
        )
    );
};


/*
|--------------------------------------------------------------------------
| POST SCORE
|--------------------------------------------------------------------------
*/

const scorePost = (post, query) => {

    let score = 0;

    score += scoreField(
        post.birdName,
        query,
        {
            exact: 100,
            startsWith: 85,
            contains: 65,
            wordMatch: 45
        }
    );

    score += scoreField(
        post.scientificName,
        query,
        {
            exact: 95,
            startsWith: 80,
            contains: 60,
            wordMatch: 40
        }
    );

    score += scoreArrayField(
        post.tags,
        query,
        {
            exact: 75,
            startsWith: 60,
            contains: 45,
            wordMatch: 30
        }
    );

    score += scoreField(
        post.description,
        query,
        {
            exact: 35,
            startsWith: 30,
            contains: 25,
            wordMatch: 15
        }
    );

    score += scoreField(
        post.country,
        query,
        {
            exact: 30,
            startsWith: 25,
            contains: 20,
            wordMatch: 10
        }
    );

    score += scoreField(
        post.state,
        query,
        {
            exact: 30,
            startsWith: 25,
            contains: 20,
            wordMatch: 10
        }
    );

    score += scoreField(
        post.city,
        query,
        {
            exact: 30,
            startsWith: 25,
            contains: 20,
            wordMatch: 10
        }
    );

    return Math.round(score * 100) / 100;
};


/*
|--------------------------------------------------------------------------
| CREATOR SCORE
|--------------------------------------------------------------------------
*/

const scoreCreator = (creator, query) => {

    let score = 0;

    score += scoreField(
        creator.displayName,
        query,
        {
            exact: 100,
            startsWith: 85,
            contains: 65,
            wordMatch: 45
        }
    );

    score += scoreField(
        creator.user?.username,
        query,
        {
            exact: 110,
            startsWith: 90,
            contains: 70,
            wordMatch: 50
        }
    );

    score += scoreField(
        creator.bio,
        query,
        {
            exact: 35,
            startsWith: 30,
            contains: 25,
            wordMatch: 15
        }
    );

    score += scoreArrayField(
        creator.specialization,
        query,
        {
            exact: 70,
            startsWith: 55,
            contains: 40,
            wordMatch: 25
        }
    );

    score += scoreField(
        creator.country,
        query,
        {
            exact: 30,
            startsWith: 25,
            contains: 20,
            wordMatch: 10
        }
    );

    score += scoreField(
        creator.state,
        query,
        {
            exact: 30,
            startsWith: 25,
            contains: 20,
            wordMatch: 10
        }
    );

    score += scoreField(
        creator.city,
        query,
        {
            exact: 30,
            startsWith: 25,
            contains: 20,
            wordMatch: 10
        }
    );

    return Math.round(score * 100) / 100;
};


/*
|--------------------------------------------------------------------------
| BIRD SCORE
|--------------------------------------------------------------------------
*/

const scoreBird = (bird, query) => {

    let score = 0;

    score += scoreField(
        bird.birdName,
        query,
        {
            exact: 100,
            startsWith: 85,
            contains: 65,
            wordMatch: 45
        }
    );

    score += scoreField(
        bird.scientificName,
        query,
        {
            exact: 110,
            startsWith: 90,
            contains: 70,
            wordMatch: 50
        }
    );

    return Math.round(score * 100) / 100;
};


module.exports = {
    scorePost,
    scoreCreator,
    scoreBird
};