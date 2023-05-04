import { Request, Response, Router } from "express";
import * as auth from "../controllers/auth.controller";
import * as challenge from '../controllers/challenges.controller';
import * as wallet from '../controllers/wallet.controller';
// import Authenticate from "../service/auth";

/**
 * Router
 * Using Passport
 */
const router = Router();

// test
router.get("/test", (req: Request, res: Response) => {
    res.json({status: "success"})
})

// Authentication
router.post("/signin", auth.SignIn);
router.post("/signup", auth.SignUp);

// Administrator challenges
router.get('/challenge/index', challenge.index);
router.post('/challenge/save', challenge.save);
router.delete('/challenge/remove/:id', challenge.remove);

// Wallet
router.post('/deposit', wallet.deposit);
router.post('/withdraw', wallet.withdraw);

export default router;
