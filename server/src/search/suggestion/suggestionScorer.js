/*
|--------------------------------------------------------------------------
| SEARCH SUGGESTION SCORER
|--------------------------------------------------------------------------
|
| Suggestions are NOT full search results.
|
| They should be:
|
| - fast
| - predictable
| - useful while typing
| - strongly biased toward exact/prefix matches
|
*/


const scoreSuggestion = ({
    query,
    text,
    type
}) => {

    if (!query || !text) {
        return 0;
    }


    const normalizedQuery =
        query
            .toLowerCase()
            .trim();


    const normalizedText =
        text
            .toLowerCase()
            .trim();


    if (!normalizedText) {
        return 0;
    }


    let score = 0;


    /*
    |--------------------------------------------------------------------------
    | Exact match
    |--------------------------------------------------------------------------
    */

    if (
        normalizedText ===
        normalizedQuery
    ) {

        score += 100;
    }


    /*
    |--------------------------------------------------------------------------
    | Starts with query
    |--------------------------------------------------------------------------
    */

    else if (
        normalizedText.startsWith(
            normalizedQuery
        )
    ) {

        score += 80;
    }


    /*
    |--------------------------------------------------------------------------
    | Word starts with query
    |--------------------------------------------------------------------------
    */

    else {

        const words =
            normalizedText.split(
                /\s+/
            );


        if (
            words.some(
                word =>
                    word.startsWith(
                        normalizedQuery
                    )
            )
        ) {

            score += 65;
        }


        /*
        |--------------------------------------------------------------------------
        | Contains query
        |--------------------------------------------------------------------------
        */

        else if (
            normalizedText.includes(
                normalizedQuery
            )
        ) {

            score += 40;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Type preference
    |--------------------------------------------------------------------------
    */

    if (type === "bird") {

        score += 10;
    }


    if (type === "creator") {

        score += 8;
    }


    if (type === "post") {

        score += 5;
    }


    return score;
};


module.exports = {
    scoreSuggestion
};