const bcrypt = require("bcrypt"); // for password hashing

const db = require("../../config/db_mysql");
const user = db.user;

const signupController = async (req, res) => {
  try {
    const { name, email, pwd, countrycode, phone, project, role } = req.body;

    if (!name || !email || !pwd || !phone || !countrycode) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const existingUser = await user.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: email, project: project },
          { countrycode: countrycode, phone: phone, project: project },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: `User exist with email or phone number for ${project}`,
      });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const allowedRoles = ["user", "admin"];

    const newUser = await user.create({
      name,
      email,
      pwd: hashedPwd,
      countrycode: countrycode,
      phone: phone,
      project: project || null,
      role: allowedRoles.includes(role) ? role : undefined,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

module.exports = signupController;
