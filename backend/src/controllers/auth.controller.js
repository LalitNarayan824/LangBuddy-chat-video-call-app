import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../utils/stream.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All the fields are Required!" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("error in the login controller :" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const register = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All the fields are Required!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be of 6 characters" });
    }
    // this email regex will mostly be copy pasted from somewhere , you dont have to learn it
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email alredy exists , please use another email!" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;

    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    //  create the user in stream as well
    //  in progress
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });

      console.log(`stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("error creating stream user: ", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("error in the register controller :" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "logout successful" });
};
export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res
        .status(400)
        .json({
          message: "All fields are required",
          missingFields: [
            !fullName && "fullName",
            !bio && "bio",
            !nativeLanguage && "nativeLanguage",
            !learningLanguage && "learningLanguage",
            !location && "location",
          ].filter(Boolean),
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body, isOnboarded: true },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "user not found" });

    //  update the user info in the stream
    try {
      await upsertStreamUser({
        id:updatedUser._id,
        name:updatedUser.fullName,
        image:updatedUser.profilePic || "",
      })
      console.log('stream user updated after onboarding for :' + updatedUser.fullName);

    } catch (error) {
      console.log("stream updating user error during onboarding" + error.message)
    }
    

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("error in the onboarding controller :" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
