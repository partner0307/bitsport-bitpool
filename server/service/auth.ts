import passport from "passport";

const Authenticate = () => passport.authenticate("jwt", { session: false });

export default Authenticate;
