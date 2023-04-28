import { ArrowDown, Quest } from "@/public/icons";
import Link from "next/link";
import Button, { variantTypes, volumeTypes } from "../Button";

export interface IItemProp {
  title: string;
  content: string;
  index: number;
}

export interface IProp {
  index: number;
  quest: {
    amount: number;
    streak: number;
    qc: number;
    difficalty: number;
  };
}

const QuestComponent = (prop: IProp) => {
  return (
    <div
      className="bg-primary-400 lg:h-20 h-14 px-5 items-center flex justify-between"
      key={prop.index}
    >
      <div className="h-11 w-11 rounded-full bg-white flex justify-center items-center">
        <Quest />
      </div>
      <div className={`flex flex-col items-center ${prop.index > 1 && "hide"}`}>
        <div className="text-primary-450 text-sm font-bold">AMOUNT</div>
        <div className=" text-white text-base font-semibold">{prop.quest.amount}</div>
      </div>
      <div className={`flex flex-col items-center ${prop.index > 1 && "hide"}`}>
        <div className="text-primary-450 text-sm font-bold">WIN STREAK</div>
        <div className=" text-white text-base font-semibold">{prop.quest.streak}</div>
      </div>
      <div className={`flex flex-col items-center ${prop.index > 1 && "hide"}`}>
        <div className="text-primary-450 text-sm font-bold">QUEST CREDIT</div>
        <div className=" text-white text-base font-semibold">{prop.quest.qc}</div>
      </div>
      <div className={`flex flex-col items-center ${prop.index > 1 && "hide"}`}>
        <div className="text-primary-450 text-sm font-bold">DIFFICALTY</div>
        <div className=" text-white text-base font-semibold">{prop.quest.difficalty}</div>
      </div>
      <Link href="/game">
        <Button
          variant={variantTypes.secondary}
          textVol={volumeTypes.sm}
          px="xl:px-20 px-5"
          text="ACCEPT"
        />
      </Link>
      <div className="cursor-pointer xl:hidden self-center">
        <ArrowDown />
      </div>
    </div>
  );
};

export default QuestComponent;
