import axios from 'axios';
import moment from 'moment';
import { Request, Response } from 'express';
import { WALLET_SERVER_URI } from '../config';
import AdminChallenge from '../models/Challenge';
import PlayChallenge from '../models/PlayChallenges';
import PlayedChallenges from '../models/PlayedChallenges';

export const start = async (req: Request, res: Response) => {
    AdminChallenge.findById(req.body.cid).then(async (challenge_model: any) => {
        if(challenge_model.status === 2) {
            res.json({ success: false, message: 'Challenge closed.' });
        }
        if(challenge_model.coin_sku !== 1) {
            const _res = axios.post(`${WALLET_SERVER_URI}/get-usdg`, { id: req.body.uid }, { headers: { debug: false, verify: false } });
            const response = (await _res).data;
            let qc = 0, usdg = 0;
            if(response !== null) {
                qc = response.qc;
            }
            if(qc < challenge_model.qc) {
                res.json({ success: false, message: 'You have too low Quest Credit' });
            }
            else if(qc > 0) {
                await axios.post(`${WALLET_SERVER_URI}/credit-qc`, { id: req.body.uid, amount: challenge_model.qc }).then(res => {
                    challenge_model.status = 2;
                    challenge_model.save();
                });
            }
        }
        PlayChallenge.findOne({ challenge: challenge_model._id, user: req.body.uid }).then((play_model: any) => {
            if(!play_model) {
                play_model = new PlayChallenge;
                play_model.user_id = req.body.uid;
                play_model.challenge_id = challenge_model._id;
                play_model.save();
                res.json({ success: true });
            }
        });
    })
}

export const get_challenge = (req: Request, res: Response) => {
    AdminChallenge.findOne({ status: 1 }).then((data: any) => {
        res.json({ status: 1, data });
    })
}

export const get_challenge_by_id = (req: Request, res: Response) => {
    AdminChallenge.findById(req.body.challenge_id).then((data: any) => {
        res.json({ status: 1, data });
    })
}

export const start_challenge = (req: Request, res: Response) => {
    AdminChallenge.findById(req.body.challenge_id).then((challenge_model: any) => {
        if(challenge_model.status === 2) {
            res.json({ status: 0, message: 'Challenge is closed' });
        } else {
            const play_challenge = new PlayChallenge;
            play_challenge.user_id = req.body.user_id;
            play_challenge.challenge_id = req.body.challenge_id;
            play_challenge.save().then(err => {
                res.json({ status: 1, message: 'Challenge Started', data: play_challenge })
            })
        }
    })
}

export const start_match = (req: Request, res: Response) => {
    PlayChallenge.find({ challenge_id: req.body.match_id, user_id: req.body.user_id }).sort({ createdAt: -1 }).then((model: any) => {
        PlayedChallenges.find({ user_id: model[0].user_id }).sort({ createdAt: -1 }).then((prev_match: any) => {
            if(prev_match.length > 0) {
                prev_match[0].winorloss = 0;
                prev_match[0].end_match = 'Closed by system';
                prev_match[0].status = 2;
                prev_match[0].save();
            }
            const start = new PlayedChallenges;
            start.challenge_id = req.body.match_id;
            start.user_id = model[0].user_id;
            start.start_match = moment().format('YYYY-MM-DD HH:mm:ss');
            start.end_match = 'not set';
            start.winorloss = 'not set';
            start.save();

            res.json({ status: 1, message: "Match Started", data: start });
        })
    })
}

export const submit_result = (req: Request, res: Response) => {
    console.log('sdff');
    const challenge_id = req.body.match_id;

    // win = 1 | loss = 0
    const result = req.body.result;
    let iswonchallenge = false;
    PlayedChallenges.findById(challenge_id).then((played_model: any) => {
        const user_id = played_model.user_id;

        // update user challenge table
        PlayChallenge.findOne({ challenge_id: played_model.challenge_id, user_id}).then((play_model: any) => {

            // update user match table
            played_model.winorloss = result;
            played_model.end_match = moment().format('YYYY-MM-DD');
            played_model.status = 2;
            played_model.save();

            // get main task
            AdminChallenge.findById(played_model.challenge_id).then((main_challenge: any)=> {
                if(result === 1)
                    play_model.win_match = play_model.win_match + 1;
                else
                    play_model.loss_match = play_model.loss_match + 1;
                play_model.save();

                // if loss back 2 step
                if(result === 0) {
                    let contrast_temp = play_model.current_match - 2;
                    if(contrast_temp < 0) {
                        contrast_temp = 0;
                    }
                    play_model.current_match = contrast_temp;
                    play_model.save();
                }

                // if win increase 1 step
                if(result === 1) {
                    play_model.current_match = play_model.current_match + 1;
                    play_model.save();
                }

                // if not win & not bitp set visible
                if(result === 0 && main_challenge.coin_sku !== 'BITP') {
                    main_challenge.status = 1;
                    main_challenge.save();
                }

                if(play_model.current_match === main_challenge.streak) {
                    play_model.status = 2;
                    play_model.iswonchallenge = 1;
                    play_model.save();

                    iswonchallenge = true;

                    AdminChallenge.findById(play_model.challenge_id).then((admin_challenge_model: any) => {
                        admin_challenge_model.status = 2;
                        admin_challenge_model.save();

                        // update user balance
                        // call to dapp api
                    });
                }

                if(iswonchallenge) {
                    axios.post(`${WALLET_SERVER_URI}/claim-reward`, { user_id: play_model.user_id, amount: main_challenge.amount, coin: main_challenge.coin_sku }, {
                        headers: { verify: false, debug: false }
                    })
                }

                res.json({ status: 1, iswon: iswonchallenge, message: 'Result submitted' });
            })
        })
    })
}