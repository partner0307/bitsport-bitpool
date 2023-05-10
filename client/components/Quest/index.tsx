import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { ArrowDown, Quest } from "@/public/icons";
import Button, { variantTypes, volumeTypes } from "../Button";
import { IState } from '@/store';
import Cookie from 'js-cookie';
import Axios from 'axios';
import { SERVER_URI } from '@/config';
import { notification } from 'antd';
import { useRouter } from 'next/router'

export interface IItemProp {
  title: string;
  content: string;
  index: number;
}

export interface IProp {
  index: number;
  quest: {
    _id: string;
    amount: number;
    streak: number;
    qc: number;
    difficalty: number;
    coin_sku: number;
  };
}

const QuestComponent = (prop: IProp) => {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const {currentUser} = useSelector((state: IState) => state.auth);

  const startGame = () => {
    if(currentUser) {
      Axios.post(`${SERVER_URI}/game/start`, { cid: prop.quest._id, uid: Cookie.get('uid') }).then(res => {
        if(res.data.success) {
          localStorage.setItem('cid', prop.quest._id);
          router.push('/game');
        } else {
          notification.warning({ message: 'Warning!', description: res.data.message });
        }
      })
    } else {
      notification.warning({ message: 'Warning!', description: 'Please login!' });
    }
  }

  return <>
    <div
      className="bg-primary-400 lg:h-20 h-14 px-5 items-center flex justify-between"
      key={prop.index}
    >
      <div className="h-11 w-11 rounded-full bg-white flex justify-center items-center">
        <Quest />
      </div>
      <div className={`flex flex-col items-center`}>
        <div className="text-primary-450 text-sm font-bold">AMOUNT</div>
        <div className=" text-white text-base font-semibold">{prop.quest.amount} {prop.quest.coin_sku === 1 ? 'BITP' : prop.quest.coin_sku === 2 ? 'BUSD' : 'USDT'}</div>
      </div>
      <div className={`flex flex-col items-center`}>
        <div className="text-primary-450 text-sm font-bold">WIN STREAK</div>
        <div className=" text-white text-base font-semibold">{prop.quest.streak}</div>
      </div>
      <div className={`flex flex-col items-center hide`}>
        <div className="text-primary-450 text-sm font-bold">QUEST CREDIT</div>
        <div className=" text-white text-base font-semibold">{prop.quest.qc}</div>
      </div>
      <div className={`flex flex-col items-center hide`}>
        <div className="text-primary-450 text-sm font-bold">DIFFICALTY</div>
        <div className=" text-white text-base font-semibold">{prop.quest.difficalty === 1 ? 'HARD' : prop.quest.difficalty === 2 ? 'MEDIUM' : 'HARD'}</div>
      </div>
      <Button
        variant={variantTypes.secondary}
        textVol={volumeTypes.sm}
        onClick={() => startGame()}
        px="xl:px-20 px-5"
        text="ACCEPT"
      />
      <div onClick={() => setOpen(!open)} className="cursor-pointer xl:hidden self-center">
        <ArrowDown />
      </div>
    </div>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="py-5 -mt-2 px-5 xl:hidden bg-primary-1200 text-primary-450 font-bold"
      >
        <div className="text-lg">CHALLENGE INFO</div>
        <div className="mt-5 mb-3 flex items-center justify-between">
          <div className="text-sm">
            AMOUNT: <span className="text-white"> 10 BITP</span>
          </div>
          <div className="text-sm">
            QUEST CREDIT: <span className="text-white"> 0.5</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            WIN STREAK: <span className="text-white"> 3</span>
          </div>
          <div className="text-sm">
            DIFFICULTY: <span className="text-white"> HARD</span>
          </div>
        </div>
      </motion.div>
    )}
  </>;
};

export default QuestComponent;
