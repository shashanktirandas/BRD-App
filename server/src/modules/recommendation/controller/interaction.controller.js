const asyncHandler = require("../../../controllers/asyncHandler");
const successResponse = require("../../../controllers/successResponse");

const interactionService = require("../service/interaction.service");

const saveInteraction = asyncHandler(async (req, res) => {

    const interaction = await interactionService.saveInteraction({
        user: req.user.id,
        ...req.body
    });

    return successResponse(res, {
        statusCode: 201,
        message: "Interaction recorded successfully.",
        data: interaction
    });

});

module.exports = {
    saveInteraction
};