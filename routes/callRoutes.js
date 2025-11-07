const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { AccessToken } = require("livekit-server-sdk");
dotenv.config();

router.post("/token", async (req, res) => {
    const { roomName, userName } = req.body;
    console.log(roomName, userName);

    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        {
            identity: userName,
        }
    );
    at.addGrant({
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        room: roomName,
    });
    const token = await at.toJwt();
    res.json({ token });
});

module.exports = router;
