import { Request, Response } from 'express';
import Challenge from '../models/Challenge';
import { IChallenge } from '../models/Interfaces/IChallenge';

interface IndexArray {
    model: []
}

export const index = async (req: Request, res: Response) => {
    Challenge.find().then((model: IndexArray) => {
        res.json({ model });
    });
}

export const save = async (req: Request, res: Response) => {
    Challenge.findOne({ title: req.body.title, qc: req.body.qc, difficalty: req.body.difficalty, streak: req.body.streak, amount: req.body.amount }).then((model: IChallenge) => {
        if(model)
            res.json({ success: false, message: 'The challenge exits!' });

        model = new Challenge;
        model.title = req.body.title;
        model.difficalty = req.body.difficalty;
        model.qc = req.body.qc;
        model.streak = req.body.streak;
        model.amount = req.body.amount;
        model.coin_sku = req.body.cointype;
        model.save().then(() => {
            res.json({ success: true, model });
        })
    })
}

export const remove = async (req: Request, res: Response) => {
    Challenge.findByIdAndDelete(req.params.id).then((model: IChallenge) => {
        res.json({ success: true, model });
    })
}