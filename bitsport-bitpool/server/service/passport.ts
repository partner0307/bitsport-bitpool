import { Strategy, StrategyOptions, ExtractJwt } from "passport-jwt";
import { SECRET_KEY } from "../config";
import User from "../models/User";

/**
 * StrategyOptions interface
 * Using passport-jwt
 */
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

/**
 * Instance Strategy Class
 */
export default new Strategy(opts, (payload, done) => {
  console.log(payload);
  try {
    const user = User.findById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.log(error);
  }
});
