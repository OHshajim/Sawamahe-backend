const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Create or get a conversation with a user
exports.createOrGetConversation = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, userId], $size: 2 },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, userId],
            });
        }

        res.json(conversation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all user conversations
exports.getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id,
        })
            .populate("participants", "firstName lastName email avatar")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
