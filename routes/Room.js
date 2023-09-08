const express = require("express");
const router = express.Router();
require('dotenv').config();
const livekitApi = require("livekit-server-sdk");
const { validateToken } = require("../middlewares/AuthMiddleware");
const AccessToken = livekitApi.AccessToken;

router.get("/get-token", validateToken, async (req, res) => {
  const { roomId, name } = req.query;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,      
    process.env.LIVEKIT_SECRET_KEY,   
    {
      identity: name,
    }
  );
  at.addGrant({ roomJoin: true, room: roomId });

  const token = at.toJwt();
  res.json({ token: token });
});

module.exports = router;