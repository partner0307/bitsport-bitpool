import moment from 'moment';
import { Request, Response } from 'express';
import AdminChallenge from '../models/Challenge';
import PlayChallenge from '../models/PlayChallenges';
import PlayedChallenges from '../models/PlayedChallenges';
import User from '../models/User';

export const start = async (req: Request, res: Response) => {
    if(req.body.uid) {
        if(req.body.cid) {
            await AdminChallenge.findOne({ index: req.body.cid }).then(async (challenge_model: any) => {
                if(challenge_model.status === 2) {
                    res.json({ success: false, message: 'Challenge closed.' });
                } else {
                    let isValid = true;
                    if(challenge_model.coin_sku !== 1) {
                        await User.findOne({ index: req.body.uid }).then((user: any) => {
                            if(user.money.quest < challenge_model.qc) {
                                isValid = false;
                            }
                            else {
                                user.money.quest -= challenge_model.qc;
                                user.save().then((err: any) => {
                                    challenge_model.status = 2;
                                    challenge_model.save();
                                });
                            }
                        });
                    }
                    if(!isValid) {
                        res.json({ success: false, message: 'You have too low Quest Credit' });
                    } else {
                        let length = 0;
                        await PlayChallenge.countDocuments().then(data => length = data);
                        await PlayChallenge.findOne({ challenge_id: challenge_model.index, user_id: req.body.uid }).then((play_model: any) => {
                            if(!play_model) {
                                play_model = new PlayChallenge;
                                play_model.user_id = req.body.uid;
                                play_model.challenge_id = challenge_model.index;
                                play_model.index = length + 1;
                                play_model.save();
                            }
                        });
                        res.json({ success: true });
                    }
                }
            })
        } else {
            res.json({ success: false, message: 'Please select correct challenge' });
        }
    } else {
        res.json({ success: false, message: 'Please login!' });
    }
}

export const get_challenge_by_id = (req: Request, res: Response) => {
    AdminChallenge.findOne({ index: req.body.challenge_id }).then((data: any) => {
        console.log('get-challenge-by-id', data);
        if(data) {
            res.json({
                status: 1,
                data: {
                    id: data.index,
                    title: data.title,
                    description: null,
                    difficulty: data.difficulty,
                    streak: data.streak,
                    amount: data.amount,
                    coin_sku: data.coin_sku === 1 ? 'BITP' : data.coin_sku === 2 ? 'BUSD' : 'USDT',
                    loss_back: null,
                    qc: 1,
                    status: "1",
                    created_at: data.createdAt,
                    updated_at: data.updatedAt
                }
            });
        }
    })
}

export const start_match = (req: Request, res: Response) => {
    PlayChallenge.find({ challenge_id: req.body.match_id, user_id: req.body.user_id }).sort({ createdAt: -1 }).then((model: any) => {
        PlayedChallenges.find({ user_id: model[0].user_id }).sort({ createdAt: -1 }).then(async (prev_match: any) => {
            if(prev_match.length > 0) {
                prev_match[0].winorloss = 0;
                prev_match[0].end_match = 'Closed by system';
                prev_match[0].status = 2;
                prev_match[0].save();
            }
            let length = 0;
            await PlayedChallenges.countDocuments().then(data => length = data);
            const start = new PlayedChallenges;
            start.challenge_id = req.body.match_id;
            start.user_id = model[0].user_id;
            start.start_match = moment().format('YYYY-MM-DD HH:mm:ss');
            start.end_match = 'not set';
            start.winorloss = 'not set';
            start.index = length + 1;
            start.save();

            AdminChallenge.findOne({ index: req.body.match_id }).then((challenge_model: any) => {
                if(challenge_model) {
                    const option = {
                        status: 1,
                        message: 'Match Started',
                        data: {
                            id: start.index,
                            challenge_id: challenge_model.index,
                            user_id: req.body.user_id,
                            start_match: start.start_match,
                            end_match: start.end_match,
                            winorloss: start.winorloss
                        }
                    }
                    res.json(option);
                }
            })
        })
    })
}

export const submit_result = (req: Request, res: Response) => {
    console.log('submit_result, first', req.body);
    const match_id = req.body.match_id;

    // win = 1 | loss = 0
    const result = req.body.result;
    let iswonchallenge = false;
    PlayedChallenges.findOne({ index: match_id }).then((played_model: any) => {
        console.log('submit_result, second', played_model);
        const user_id = played_model.user_id;

        // update user match table
        played_model.winorloss = result;
        played_model.end_match = moment().format('YYYY-MM-DD');
        played_model.status = 2;
        played_model.save();

        // update user challenge table
        PlayChallenge.findOne({ challenge_id: played_model.challenge_id, user_id}).then((play_model: any) => {
            // get challenge info
            AdminChallenge.findOne({ index: played_model.challenge_id }).then(async (main_challenge: any)=> {
                if(Number(result) === 1) {
                    play_model.win_match += 1;
                    play_model.current_match += 1;
                } else {
                    let contrast_temp = play_model.current_match - 2;
                    play_model.loss_match = play_model.loss_match + 1;
                    if(contrast_temp < 0) {
                        contrast_temp = 0;
                    }
                    play_model.current_match = contrast_temp;
                    if(main_challenge.coin_sku !== 1) {
                        main_challenge.status = 1;
                        main_challenge.save();
                    }
                }
                await play_model.save();
                console.log(play_model.current_match === main_challenge.streak);

                if(play_model.current_match === main_challenge.streak) {
                    play_model.status = 2;
                    play_model.iswonchallenge = 1;
                    await play_model.save();

                    iswonchallenge = true;

                    main_challenge.status = 2;
                    await main_challenge.save();
                }

                if(iswonchallenge) {
                    User.findOne({ index: play_model.user_id }).then((user: any) => {
                        console.log(main_challenge, user);
                        if(main_challenge.coin_sku === 1)
                            user.money.bitp += main_challenge.amount;
                        else if(main_challenge.coin_sku === 2)
                            user.money.busd += main_challenge.amount;
                        else if(main_challenge.coin_sku === 3)
                            user.money.usdt += main_challenge.amount;
                        else if(main_challenge.coin_sku === 4)
                            user.money.cake += main_challenge.amount;

                        user.save();
                    });
                }

                res.json({ status: 1, iswon: iswonchallenge, message: 'Result submitted' });
            })
        })
    })
}