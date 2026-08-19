const express=require("express");const User = require("../model/user");
const mongoose = require("mongoose");
const router=express.Router();

router.get("/transaction-test", async (req, res) => {

    const session = await mongoose.startSession();

    try {

        await session.withTransaction(async () => {

            const user = await User.findOne().session(session);

            //console.log(user);

        });

        return res.json({
            success: true
        });

    } finally {

        await session.endSession();

    }

});

module.exports=router;