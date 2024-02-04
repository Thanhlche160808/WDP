// ** Entity
import User from "../models/user";

// ** Libs
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ** Helpers
import { message } from "../helpers/message";

class AuthService {
  async createUser({ username, email, password, firstName, lastName, gender }) {
    const user = new User({
      email,
      username,
      firstName,
      password,
      lastName,
      gender,
    });

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();

    const userJson = user.toJSON();

    delete userJson.password;
    delete userJson.refreshToken;
    delete userJson.blockedUsers;

    return userJson;
  }

  async getTokens(payload) {
    const [accessToken, refreshToken] = await Promise.all([
      jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
        expiresIn: process.env.EXPIRES_ACCESS_TOKEN,
      }),
      jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.EXPIRES_REFRESH_TOKEN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login({ usernameOrEmail, password }) {
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) throw new Error(message.incorrect("usernameOrEmail"));

    if (!bcrypt.compareSync(password, user.password))
      throw new Error(message.incorrect("password"));

    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.refreshToken;
    delete userJson.blockedUsers;

    // Get access-token & refresh-token
    const payload = {
      id: userJson._id,
      name: `${userJson.lastName} ${userJson.firstName}`,
      email: userJson.email,
      role: userJson.role,
    };

    const { accessToken, refreshToken } = await this.getTokens(payload);

    return {
      user: userJson,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
