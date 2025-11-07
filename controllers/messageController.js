const Message = require("../models/Message");
const xss = require("xss");
const Rooms = require("../models/Rooms");
const store = require("../store");

// Send message
exports.sendMessage = (req, res, next) => {
  const { roomID, authorID, content, type, fileID } = req.body;

  Message({
    room: roomID,
    author: authorID,
    content: xss(content),
    type,
    file: fileID,
  })
    .save()
    .then((message) => {
      Message.findById(message._id)
        .populate({
          path: 'author',
          select: '-email -password -friends -__v',
          populate: [
            {
              path: 'picture',
            },
          ],
        })
        .populate([{ path: 'file', strictPopulate: false }])
        .then((message) => {
          Rooms.findByIdAndUpdate(roomID, {
            $set: { lastUpdate: message.date, lastMessage: message._id, lastAuthor: authorID },
          })
            .then((room) => {
              room.people.forEach((person) => {
                const myUserID = req.user._id;
                const personUserID = person.toString();

                if (personUserID !== myUserID) {
                  store.io.to(personUserID).emit('message-in', { status: 200, message, room });
                }
              });
              res.status(200).json({ message, room });
            })
            .catch((err) => {
              return res.status(500).json({ error: true });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: true });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: true });
    });
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
