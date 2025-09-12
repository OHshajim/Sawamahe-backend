const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, content, type = "text" } = req.body;
        const sender = req.user._id;

        const message = await Message.create({
            conversationId,
            sender,
            content,
            type,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
        });

        res.json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get messages with pagination
exports.getMessages = async (req, res) => {
    try {
        const { skip = 0, limit = 20 } = req.query;
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        })
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate("sender", "firstName lastName email avatar");

        res.json(messages.reverse());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Mark message as seen
exports.markMessageSeen = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { seenBy: req.user._id } },
            { new: true }
        );

        res.json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
