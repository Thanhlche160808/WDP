import jwt from "jsonwebtoken";

import { authConstant } from "../constants"

export const verifyAccessToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token)
      return res
        .status(401)
        .json({ stautsCode: 401, message: authConstant.UNAUTHORIZED });

    if (token.startsWith("Bearer "))
      token = token.slice(7, token.length).trimLeft();

    const payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ stautsCode: 401, message: err.message });
  }
};
