import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import * as challenge from '../controllers/challenges.controller';
import * as wallet from '../controllers/wallet.controller';
import * as game from '../controllers/game.controller';
import axios from 'axios';
// import Authenticate from "../service/auth";

/**
 * Router
 * Using Passport
 */
const router = Router();

// Authentication
router.post("/signin", auth.SignIn);
router.post("/signup", auth.SignUp);

// Administrator challenges
router.get('/challenge/index', challenge.index);
router.post('/challenge/save', challenge.save);
router.delete('/challenge/remove/:id', challenge.remove);

// Wallet
router.post("/deposit", wallet.deposit);
router.post("/withdraw", wallet.withdraw);
router.post("/getUserInfo", wallet.getUserInfo);
router.post("/swap", wallet.swap);
router.post("/withdrawHistory", wallet.withdrawHistory);

// Game
router.post('/game/start', game.start);
router.post('/get-challenge-by-id', game.get_challenge_by_id);
router.post('/start-match', game.start_match);
router.post('/submit-match-result', game.submit_result);

export default router;
