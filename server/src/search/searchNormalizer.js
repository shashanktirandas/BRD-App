const normalizeSearchQuery = (query) => {
    if (typeof query !== "string") {
        return {
            original: "",
            normalized: "",
            terms: []
        };
    }

    const original = query.trim();

    const normalized = original
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    const terms = normalized
        .split(" ")
        .filter(Boolean);

    return {
        original,
        normalized,
        terms
    };
};

module.exports = normalizeSearchQuery;
