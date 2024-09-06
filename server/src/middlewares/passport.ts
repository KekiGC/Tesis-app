import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from '../config/config'
import User, { IUser } from "../models/user";

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
};


export default new Strategy(opts, async (payload, done) => {
    try {
        const user = await User.findById(payload.id) as IUser;
        if(user){
            const userId = user._id
            return done(null, user);

        }
        return done(null, false);
    } catch (error) {
        console.log(error)
    }
})