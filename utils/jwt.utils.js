// JWT helper class
import jwt from 'jsonwebtoken'

class jwtHelper {

  generateToken(user, secret = process.env.JWT_SECRET) {
    return jwt.sign(
      {
        userId: user._id,
        // email: user.email // Removed PII
      },
      secret,
      { expiresIn: "24h" }
    );
  }

  // Generate Session Token (12h)
  generateSessionToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        username: user.username
      },
      process.env.JWT_SESSION_SECRET,
      { expiresIn: "12h" }
    );
  }
}

export default new jwtHelper()