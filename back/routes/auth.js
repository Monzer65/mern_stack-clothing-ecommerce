/** @format */
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const RevokedToken = require("../models/RevokedToken");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { authLimmiter } = require("../middlewares/rateLimmiter");

router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

async function sendCodeToEmail(user, contact) {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationCodeExpiration = Date.now() + 3 * 60 * 1000;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: contact,
      subject: "Verification code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent");

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          verificationCode: verificationCode,
          verificationCodeExpiration: verificationCodeExpiration,
        },
      }
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email");
  }
}

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res
        .status(409)
        .json({ error: "the user already exists and verified" });
    }

    if (
      existingUser &&
      !existingUser.isVerified &&
      existingUser.verificationCodeExpiration > Date.now()
    ) {
      return res
        .status(409)
        .json({ error: "the user already requested a verification code" });
    }

    if (
      existingUser &&
      !existingUser.isVerified &&
      existingUser.verificationCodeExpiration < Date.now()
    ) {
      try {
        await User.deleteOne({ _id: existingUser._id });
      } catch (error) {
        console.error("Error during deleting user", error);
      }
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    await sendCodeToEmail(newUser, email);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (user.isVerified) {
      return res.status(409).json({ error: "User already verified" });
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCodeExpiration < Date.now()
    ) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    await User.updateOne(user, {
      $set: {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpiration: null,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
    s;
  }
});

router.post("/login", authLimmiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "User not verified yet" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "User not verified" });
    }

    await sendCodeToEmail(user, email);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, verificationCode, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (
      user.verificationCode !== verificationCode ||
      user.verificationCodeExpiration < Date.now()
    ) {
      return res.status(401).json({ error: "Invalid verification code" });
    }

    await User.updateOne({ _id: user._id }, { $set: { password } });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const oldAccessToken = req.headers.authorization.split(" ")[1];

    const existingrevokedToken = await RevokedToken.findOne({
      token: oldAccessToken,
    });

    if (existingrevokedToken) {
      return res.status(400).json({ message: "Token already revoked" });
    }

    const revokedToken = await RevokedToken.create({ token: oldAccessToken });

    if (!revokedToken) {
      return res.status(500).json({ message: "Failed to revoke token" });
    }

    const cookies = req.cookies;

    if (!cookies?.refreshToken) {
      return res.sendStatus(204);
    }

    const refreshToken = cookies.refreshToken;

    res.clearCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res
      .status(200)
      .json({ message: "cookie cleared. logged out successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/refresh-token", async (req, res, next) => {
  try {
    const cookies = req.cookies;

    console.log(req.cookies);
    if (!cookies?.refreshToken) {
      return res.status(403).json("refresh token not found");
    }

    const refreshToken = cookies.refreshToken;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json("forbidden");
        }

        const user = await User.findOne({ username: decoded.username });

        if (!user) {
          return res.status(401).json("unauthorized");
        }

        const accessToken = jwt.sign(
          {
            userInfo: {
              username: user.username,
              role: user.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ accessToken });
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
