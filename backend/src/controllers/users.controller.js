import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log(
      "error in the getRecommendedUsers controller :" + error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("error in the getMyFriends controller :" + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cant send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with the recipient" });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        {
          sender: recipientId,
          recipient: myId,
        },
      ],
    });

    if(existingRequest){
      return res.status(400).json({message :" A friend request alredy exists between you and this user"});
    }


    const friendRequest= await FriendRequest.create({
      sender:myId,
      recipient:recipientId
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("error in the sendFriendRequest controller :" + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const acceptFriendRequest = async (req, res)=>{
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId)

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    // verify current user is the recipient of the request
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });
    
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });

  } catch (error) {
    console.log("error in the acceptFriendRequest controller :" + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const getMyFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomingReqs = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    })
      .populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      recipient: userId,
      status: "accepted",
    })
      .populate("sender", "fullName profilePic");  

    res.status(200).json({incomingReqs , acceptedReqs});
  } catch (error) {
    console.log(
      "error in the getMyFriendRequests controller :" + error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  } 
}

export const getOutgoingFriendReqs = async (req, res) => {
  try {
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    })
      .populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
      
    res.status(200).json(outgoingReqs);
  } catch (error) {
    console.log(
      "error in the getOutgoingFriendReqs controller :" + error.message);
    res.status(500).json({ message: "Internal Server Error" }); 
  }
}