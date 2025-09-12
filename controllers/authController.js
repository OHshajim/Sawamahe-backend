const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.AUTH_SECRET, { expiresIn: "7d" });
};

// Register
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password required" });
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        });

        await user.save();
        // remove password from output
        const { password: _, ...userWithoutPass } = user.toObject();

        res.status(201).json({
            user: userWithoutPass,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        // remove password from output
        const { password: _, ...userWithoutPass } = user.toObject();

        res.json({
            user: userWithoutPass,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Profile (protected)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Send email
        await sendEmail(
            user.email,
            "Password Reset OTP",
            `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`
        );

        res.json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;
        
        const user = await User.findOne({
            email,
            resetPasswordOTP: code,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user)
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};