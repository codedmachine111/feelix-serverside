const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if user exits already in the DB
  const user = await prisma.User.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    bcrypt.compare(password, user.password).then((match) => {
      if (match) {
        const accessToken = sign(
          { id: user.id, username: user.username, email: user.email },
          "important"
        );
        res.json({
          message: "User logged in Successfully!",
          email: user.email,
          username: user.username,
          userId: user.id,
          accessToken: accessToken,
        });
      } else {
        res.json("Wrong email/ password!");
      }
    });
  } else {
    res.json("User does not exit!");
  }
});

router.get("/verify", validateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.User.findFirst({
      where: {
        id: userId,
      },
    });

    if (user) {
      res.json({ user: user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to verify user" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  // Check if a user exits with that email
  const user = await prisma.User.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    // Create a user
    const hash = await bcrypt.hash(password, 10);
    await prisma.User.create({
      data: {
        username: username,
        email: email,
        password: hash,
      },
    });
    res.json("User Created Successfully!");
  } else {
    res.json("This email already exits!");
  }
});

module.exports = router;
