const buildQuery = (query) => {

    const {
        q,
        country,
        state,
        city,
        cameraBrand,
        cameraModel,
        birdName,
        sort,
        page
    } = query;

    // ------------------------
    // Search Query
    // ------------------------

    let searchQuery = {};

    if (q) {
        searchQuery = {
            $or: [
                {
                    birdName: {
                        $regex: q,
                        $options: "i"
                    }
                },
                {
                    scientificName: {
                        $regex: q,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: q,
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: q,
                        $options: "i"
                    }
                }
            ]
        };
    }

    // ------------------------
    // Filter Query
    // ------------------------

    const filterQuery = {};

    if (country) {
        filterQuery.country = {
            $regex: country,
            $options: "i"
        };
    }

    if (state) {
        filterQuery.state = {
            $regex: state,
            $options: "i"
        };
    }

    if (city) {
        filterQuery.city = {
            $regex: city,
            $options: "i"
        };
    }

    if (cameraBrand) {
        filterQuery.cameraBrand = {
            $regex: cameraBrand,
            $options: "i"
        };
    }

    if (cameraModel) {
        filterQuery.cameraModel = {
            $regex: cameraModel,
            $options: "i"
        };
    }

    if (birdName) {
        filterQuery.birdName = {
            $regex: birdName,
            $options: "i"
        };
    }

    // ------------------------
    // Final Query
    // ------------------------

    let finalQuery = {};

    if (q && Object.keys(filterQuery).length > 0) {

        finalQuery = {
            $and: [
                searchQuery,
                filterQuery
            ]
        };

    } else if (q) {

        finalQuery = searchQuery;

    } else {

        finalQuery = filterQuery;

    }

    // ------------------------
    // Sorting
    // ------------------------

    let sortOption = {
        createdAt: -1
    };

    if (sort === "oldest") {
        sortOption = {
            createdAt: 1
        };
    }

    // ------------------------
    // Pagination
    // ------------------------

    const limit = 10;

    const currentPage = Number(page) || 1;

    const skip = (currentPage - 1) * limit;

    // ------------------------
    // Return
    // ------------------------

    return {
        finalQuery,
        sortOption,
        currentPage,
        skip,
        limit
    };

};

module.exports = buildQuery;