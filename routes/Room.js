const express = require("express");
const router = express.Router();
require('dotenv').config();

const { validateToken } = require("../middlewares/AuthMiddleware");

const livekitApi = require("livekit-server-sdk");
const AccessToken = livekitApi.AccessToken;

const  { v4: uuidv4, v4} = require('uuid');

router.get("/get-token", validateToken, async (req, res) => {
  const { roomName, username } = req.query;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,      
    process.env.LIVEKIT_SECRET_KEY,   
    {
      identity: username,
    }
  );

  const roomId = roomName + '-' + v4();

  at.addGrant({ roomJoin: true, room: roomId });

  const token = at.toJwt();
  res.json({ token: token, roomId: roomId });
});

module.exports = router;