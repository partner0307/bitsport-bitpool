import { Swap as SwapI, SwapArrow, SwapIcon, SwapTo } from "@/public/icons";
import Image from "next/image";
import QIC from "@/public/qc.png";
import BUSD from "@/public/busd.png";
import SuccessIcon from "@/public/success.png";
import FailedIcon from "@/public/failed.png";
import { useState } from "react";

const Swap = () => {
  const [step, setStep] = useState(0);

  const next = (num?: number) => {
    if (num !== undefined) {
      setStep(step - 1);
    } else {
      setStep(step + 1);
    }
  };

  const components = [
    <SwapCoin next={next} />,
    <Success next={next} isSuccessful={true} />,
    <Success next={next} isSuccessful={false} />,
    <SwapTransactions />,
  ];
  return <div className="w-full xl:px-3">{components[step]}</div>;
};

export default Swap;

const SwapCoin = ({ next }: { next: (num?: number) => void }) => {
  return (
    <div>
      <div className="lg:text-2xl text-xl font-bold text-primary-900">SWAP</div>
      <div className="relative">
        <div className="mt-4 flex justify-between items-center">
          <div className="lg:text-lg text-base font-bold text-primary-450">
            SWAP TOKENS IN AN INSTANT
          </div>
          <SwapI />
        </div>
        <div className="absolute opacity-40 right-0 lg:-left-8 mt-5 lg:w-modal w-full thin-line bg-white" />
      </div>
      <div className="mt-24 flex items-center justify-between">
        <Image
          className="h-7 w-9 lg:h-14 lg:w-16 object-contain"
          priority={true}
          src={BUSD}
          alt="crypto coin"
        />
        <div className="font-medium text-sm text-white lg:text-xl">BUSD</div>
        <SwapArrow />
        <input
          type="number"
          placeholder="0.00"
          className="bg-secondary-400 text-xl text-right px-4 h-12 lg:w-60 lg:h-14 placeholder:text-white placeholder:font-medium font-medium text-white rounded border-none outline-none"
        />
      </div>
      <div className="flex justify-center items-center mt-14">
        <SwapIcon />
      </div>
      <div className="mt-14 flex items-center justify-between">
        <Image
          className="h-7 w-9 lg:h-14 lg:w-16 object-contain"
          priority={true}
          src={QIC}
          alt="quest credit"
        />
        <div className="font-medium text-sm text-white lg:text-xl">QUEST</div>
        <SwapArrow />
        <input
          type="number"
          placeholder="0.00"
          className="bg-secondary-400 text-xl text-right px-4 h-12 lg:w-60 lg:h-14 placeholder:text-white placeholder:font-medium font-medium text-white rounded border-none outline-none"
        />
      </div>

      <button
        onClick={() => next()}
        className="mt-14 bg-secondary-300 text-white w-full rounded font-bold text-xl h-14"
      >
        SWAP
      </button>
    </div>
  );
};

const Success = ({
  next,
  isSuccessful,
}: {
  next: (num?: number) => void;
  isSuccessful: boolean;
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="lg:w-96 flex flex-col justify-center items-center">
        <Image
          className="h-20 mt-10 w-20 lg:h-28 lg:w-28 object-contain"
          priority={true}
          src={isSuccessful ? SuccessIcon : FailedIcon}
          alt="success"
        />
        <h3 className="text-primary-900 mt-10 font-bold text-3xl">
          {isSuccessful ? "SWAP SUCCESSFUL" : "SWAP UNSUCCESSFUL"}
        </h3>
        <p className="mt-3 text-sm font-bold text-primary-450 text-center">
          THE TRANSACTION HAS BEEN SUCCESSFULLY PROCESSED. THE TRANSFER MAY
          STILL BE IN PROCESS. PLEASE CHECK THE TRANSACTION RECORD LATER.
        </p>
        <div className="pb-7 gap-10 mt-3 flex justify-between px-5 items-center">
          <div>
            <p className="mt-3 text-left text-sm font-bold text-primary-450">
              FROM
            </p>
            <p className="text-white font-medium lg:text-xl text-base">
              0.00 BUSD
            </p>
          </div>
          <SwapTo />
          <div>
            <p className="mt-3 text-left text-sm font-bold text-primary-450">
              TO
            </p>
            <p className="text-white font-medium lg:text-xl text-base">
              0.00 USDT
            </p>
          </div>
        </div>
        <div className="opacity-40 w-full thin-line bg-white" />
      </div>
      <div className="mt-16 flex justify-between gap-5">
        <button
          onClick={() => next(0)}
          className=" bg-secondary-300 px-5 lg:px-8 rounded font-bold text-base h-12"
        >
          BACK TO SWAP
        </button>
        <button
          onClick={() => next()}
          className=" bg-primary-1150 whitespace-nowrap px-5 lg:px-8 rounded font-bold text-base h-12"
        >
          VIEW SWAP HISTORY
        </button>
      </div>
    </div>
  );
};

const SwapTransactions = () => {
  return (
    <div className="pb-32">
      <div className="lg:text-2xl text-xl font-bold text-primary-900">
        SWAP TO QUEST CREDIT
      </div>
      <div className="relative">
        <div className="mt-4 flex justify-between items-center">
          <div className="lg:text-lg text-base font-bold text-primary-450">
            RECENT TRANSACTION
          </div>
          <SwapI />
        </div>
        <div className="absolute opacity-40 right-0 lg:-left-8 mt-5 lg:w-modal w-full thin-line bg-white" />
      </div>

      <div className="mt-14 w-full">
        <div className="flex gap-7 items-center font-bold text-xs text-primary-1100">
          <div className="hidden lg:block">COIN</div>
          <div>COIN NAME</div>
          <div>AMOUNT</div>
          <SwapTo />
          <div className="hidden lg:block">COIN</div>
          <div>COIN NAME</div>
          <div>AMOUNT</div>
        </div>

        <div className="grid grid-cols-5 lg:grid-cols-7 mt-5 items-center font-medium text-sm text-white">
          <Image
            className="h-6 hidden lg:block w-7 lg:h-8 lg:w-9 object-contain"
            priority={true}
            src={BUSD}
            alt="coin"
          />
          <div>BUSD</div>
          <div className="ml-4 lg:ml-3">20.00</div>
          <div className="ml-2.5 lg:ml-3.5">
            <SwapTo />
          </div>
          <Image
            className="h-6 hidden lg:block w-7 lg:-ml-3 lg:h-8 lg:w-9 object-contain"
            priority={true}
            src={QIC}
            alt="quest credit"
          />
          <div>QUEST</div>
          <div>2.00</div>
        </div>
      </div>
    </div>
  );
};
