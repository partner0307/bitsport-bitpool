import { Request, Response, Router } from "express";
import * as auth from "../controllers/auth.controller";
import * as challenge from '../controllers/challenges.controller';
import * as wallet from '../controllers/wallet.controller';
import * as game from '../controllers/game.controller';
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
router.post('/withdraw/index', wallet.withdraw_index);
router.post('/deposit', wallet.deposit);
router.post('/withdraw', wallet.withdraw);


// Game
router.post('/game/start', game.start);
router.post('/get-challenge', game.get_challenge);

export default router;
