const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
