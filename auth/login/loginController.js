const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const db = require("../../config/db_mysql");
const { Op } = require("sequelize");
const user = db.user;
const session = db.session;

const loginController = async (req, res) => {
  try {
    const { email, pwd, phone, countrycode, isOTPSlected, project } = req.body;

    if (!isOTPSlected) {
      if (!project) {
        return res
          .status(400)
          .json({ success: false, message: "Project is required" });
      }

      if (!email && (!phone || !countrycode)) {
        return res.status(400).json({
          success: false,
          message: "Either email or phone + countrycode required",
        });
      }

      if (!pwd) {
        return res
          .status(400)
          .json({ success: false, message: "Password is required" });
      }

      // 1️⃣ Find user by email or phone first (no password filter here)
      const whereCondn = {
        [Op.and]: [
          { project }, // always required
          {
            [Op.or]: [
              email ? { email } : null, // only add if email is present
              phone && countrycode ? { phone, countrycode } : null, // only add if both exist
            ].filter(Boolean), // removes null/undefined entries
          },
        ],
      };

      const userFound = await user.findOne({
        where: whereCondn,
      });

      if (!userFound) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 2️⃣ Compare password with stored hash
      const isMatch = await bcrypt.compare(pwd, userFound.pwd);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      // 3️⃣ Detect bots (simple detection)
      const userAgent = req.headers["user-agent"] || "";
      const ipAddress = req.ip;
      const isBot = /curl|Postman|python-requests|headless/i.test(userAgent);

      // 4️⃣ Optional: limit simultaneous sessions per user
      const activeSessions = await session.count({
        where: { userId: userFound.id },
      });
      if (activeSessions > 3) {
        // optionally delete oldest session or deny new login
      }

      const newSession = await session.create({
        sessionId: uuidv4(),
        userId: userFound.id,
        ipAddress: ipAddress,
        userAgent: userAgent,
        isBot: isBot,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hrs
      });

      // 3️⃣ Send success response
      return res.status(200).json({
        success: true,
        message: "Login Successful",
        session: {
          sessionId: newSession.sessionId,
          expiresAt: newSession.expiresAt,
        },
        data: {
          name: userFound.name,
          email: userFound.email,
          countrycode: userFound.countrycode,
          phone: userFound.phone,
          role: userFound.role,
        },
      });
    }

    // 🚧 (Optional) Implement OTP login here if required
    return res
      .status(400)
      .json({ success: false, message: "OTP login not implemented yet" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

module.exports = loginController;
