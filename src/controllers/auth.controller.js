const { sendEmailWithTemplate } = require("../utils/email");
const userService = require("../service/user.service");
const emailService = require("../utils/email");
class AuthController {
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const response = await userService.loginUser(username, password);
      return res.status(response.statusCode).send(response);
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async signup(req, res) {
    const { username, password, email } = req.body;
    try {
      const response = await userService.createUser(username, password, email);
      if (response.error) {
        return res
          .status(response.statusCode)
          .json({ message: response.message });
      }

      const data = {
        subject: "Welcome to Express Template",
        username: username,
      };
      await emailService.sendEmailWithTemplate(email, data);
      return res.status(response.statusCode).send(response);
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new AuthController();
