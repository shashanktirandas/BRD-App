const successResponse = require("../../../controllers/successResponse");
const recommendationService =
    require("../service/recommendation.service");

const getPersonalizedMenu = async (req, res) => {

    const userId = req.accessToken.userid;

    const menu =
        await recommendationService.getPersonalizedMenu(
            userId
        );

    successResponse(res, {
        message: "Personalized menu retrieved successfully.",
        data: menu
    });
};

module.exports = {
    getPersonalizedMenu
};