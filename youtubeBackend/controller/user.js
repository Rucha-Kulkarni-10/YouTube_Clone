const User = require("../model/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Channel = require("../model/channel.js");

const getUser = async (req, res) => {
  try {
    const userid = req.user._id; //getting the user id from the cookie
    const user = await User.findById(userid); //finding the user in the database
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" }); //if the user is not found sending 404
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        channels: user.channels,
      },
    }); //sending the user
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body; //getting the email and password from the request body
    const user = await User.findOne({ email }); //finding the user in the database by email
    //sending 404 if the user is not found
    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password); //comparing the password from the request body with the hashed password in the database
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect", success: false }); //sending 401 if the password is incorrect
    }
    const channel = await Channel.findOne({ owner: user._id });
    //creating a token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        channels: user.channels,
        channel,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    console.log("token :", token);
    //storing token in cookie
    if (!token) {
      return res.status(500).json({
        message: "Error occurred while generating token",
        success: false,
      });
    }
    res.cookie("authtoken", token, {
      sameSite: "none",
      credentials: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: false,
    });
    //sending success response
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.log("error : ", error);
    return res.status(500).json({ error: error.message });
  }
};

function signout(req, res) {
  res.clearCookie("authtoken", {
    sameSite: "none",
    secure: true,
    Credentials: true,
    domain: "youtube-backend-eight.vercel.app",
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
}

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body;
    const pwdHash = await bcrypt.hash(password, 10); // storing hashed password in DB
    // creating new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: pwdHash,
      avatar,
    });

    // sending success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // checking if user already exists
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        error,
      });
    }

    // sending error response
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error,
    });
  }
};

module.exports = { getUser, signin, signout, signup };
