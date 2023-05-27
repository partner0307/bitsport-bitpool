import { Request, Response } from 'express';
import Challenge from '../models/Challenge';

export const index = async (req: Request, res: Response) => {
    Challenge.find().then((models: any) => {
        res.json({ models });
    });
}

export const save = async (req: Request, res: Response) => {
    Challenge.findOne({ title: req.body.title, qc: req.body.qc, difficulty: req.body.difficulty, streak: req.body.streak, amount: req.body.amount }).then(async (model: any) => {
        if(model)
            res.json({ success: false, message: 'The challenge exits!' });

        let length = 0;
        await Challenge.find().countDocuments().then(data => length = data);

        model = new Challenge;
        model.title = req.body.title;
        model.difficulty = req.body.difficulty;
        model.qc = req.body.qc;
        model.streak = req.body.streak;
        model.amount = req.body.amount;
        model.coin_sku = req.body.cointype;
        model.index = length + 1;
        model.save().then(() => {
            res.json({ success: true, model });
        })
    })
}

export const remove = async (req: Request, res: Response) => {
    Challenge.findByIdAndDelete(req.params.id).then((model: any) => {
        res.json({ success: true, model });
    })
}