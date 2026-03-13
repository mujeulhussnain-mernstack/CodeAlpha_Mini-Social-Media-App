import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Post from "../models/post.model.js"
import fileUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "All the fields are required", success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exist", success: false });
    }
    const userName = await User.findOne({ username });
    if (userName) {
      return res
        .status(400)
        .json({ message: "Username already taken", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "Account created.", success: true });
  } catch (error) {
    console.log("Error in register controller:", error);
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All the fields are required", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid email and password", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ message: "Invalid email and password", success: false });
    }
    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: `Welcome ${user.username}`, success: true, user });
  } catch (error) {
    console.log("Error in Login controller:", error);
  }
};

export const Logout = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logout", success: true });
  } catch (error) {
    console.log("Error in Logout controller :", error);
  }
};

export const EditProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid email and password", success: false });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) {
      const dataUri = await fileUri(profilePicture);
      const cloudResponse = await cloudinary.uploader.upload(dataUri);
      user.profilePicture = cloudResponse.secure_url;
    }
    await user.save();
    return res.status(200).json({ message: "Updated", success: true, user });
  } catch (error) {
    console.log("Error in edit profile controller:", error);
  }
};

export const FollowOrUnfollow = async (req, res) => {
  try {
    const userId = req.id;
    const otherUserId = req.params.id;

    if (userId === otherUserId) {
      return res.status(400).json({
        message: "You cannot follow or unfollow yourself.",
        success: false,
      });
    }

    const [user, otherUser] = await Promise.all([
      User.findById(userId),
      User.findById(otherUserId),
    ]);

    if (!user || !otherUser) {
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    const isFollowing = user.following.includes(otherUserId);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(userId, {
        $pull: { following: otherUserId },
      });
      await User.findByIdAndUpdate(otherUserId, {
        $pull: { followers: userId },
      });

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
        isFollowing: false,
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(userId, {
        $push: { following: otherUserId },
      });
      await User.findByIdAndUpdate(otherUserId, {
        $push: { followers: userId },
      });

      return res.status(200).json({
        message: "Followed successfully",
        success: true,
        isFollowing: true,
      });
    }
  } catch (error) {
    console.log("Error in follow or unfollow controller:", error);
  }
};

export const GetSuggestedUsers = async (req, res) => {
  try {
    const userId = req.id;

    // Get the current user to see who they already follow
    const currentUser = await User.findById(userId).select("following");

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Find users who are:
    // 1. Not the current user
    // 2. Not already followed by the current user
    // 3. Limit to 10 suggestions
    const suggestedUsers = await User.find({
      _id: {
        $ne: userId, // Not current user
        $nin: currentUser.following, // Not already followed
      },
    })
      .sort({ createdAt: -1 }) // Newest first
      .limit(5) // Limit to 10 suggestions
      .select("-password"); // Exclude password

    // Check if we have enough suggestions
    if (suggestedUsers.length === 0) {
      return res
        .status(200)
        .json({ message: "Sorry! no suggested user.", success: false });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("Error in get suggested users controller:", error);
  }
};

export const GetProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const userPosts = await Promise.all(user.posts.map(async (p) => {
      const post = await Post.findById(p)
      if (post) {
        return post
      }
      return null
    }))
    user = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      posts: userPosts
    }
    return res.status(200).json({success: true, user})
  } catch (error) {
    console.log("Error in get profile controller:", error)
  }
}

export const SearchedUser = async (req, res) => {
  try {
    const { searchedUser } = req.body;
    const currentUserId = req.id; // Get current user ID from auth middleware
    console.log(searchedUser)
    // Check if search term is provided
    if (!searchedUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Search term is required" 
      });
    }

    // Find users by username (partial match, case insensitive)
    // Exclude the current user from search results
    const users = await User.find({ 
      username: { $regex: searchedUser, $options: 'i' },
      _id: { $ne: currentUserId } // Exclude current user
    })
    .select("-password")
    .limit(10); // Limit results to 10 users

    // Check if any users found
    if (users.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: "No users found",
        data: [] 
      });
    }

    // Get the current user to check following status
    const currentUser = await User.findById(currentUserId);

    // Add isFollowing flag to each user
    const usersWithFollowStatus = users.map(user => {
      const userObj = user.toObject();
      userObj.isFollowing = currentUser.following.includes(user._id);
      return userObj;
    });

    // Return users data with following status
    return res.status(200).json({ 
      success: true, 
      message: "Users found successfully",
      data: usersWithFollowStatus 
    });

  } catch (error) {
    console.log("Error in searched user controller:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};