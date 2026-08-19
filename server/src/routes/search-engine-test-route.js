const express = require("express");

const router = express.Router();

const searchEngine = require("../search/searchEngine");

router.get("/", async (req, res) => {
    try {
        const {
            q = "",
            type = "all",
            page = 1,
            limit = 20
        } = req.query;

        const results = await searchEngine({
            query: q,
            type,
            page,
            limit,
            userId: req.user?._id ||
                    req.query.userId ||
                    null
        });

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {

        console.error("NEW SEARCH ENGINE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Search engine failed",
            error: error.message
        });
    }
});

module.exports = router;