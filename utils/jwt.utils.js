// JWT helper class
import jwt from 'jsonwebtoken'

class jwtHelper {

    generateToken(user) {
        return jwt.sign(
          {
            userId: user._id,
            email: user.email
          },
          process.env.JWT_SECRET,
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