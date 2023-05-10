import Link from 'next/link';
import { Header, Swap } from "@/components";
import { EmptyTransaction, Filter, QC, USDG } from "@/public/icons";
import Image from "next/image";
import USDT from "@/public/usdt.png";
import QIC from "@/public/qc.png";
import Paypal from "@/public/paypal.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";
import CAKE from '@/public/cake.png';
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import { useState } from "react";

const items = [
  {
    icon: BUSD,
    name: "BUSD",
    value: "5.00",
    type: "deposit",
    hasWithdraw: true,
  },
  {
    icon: USDT,
    name: "USDT",
    value: "5.00",
    type: "deposit",
    hasWithdraw: true,
  },
  {
    icon: CAKE,
    name: "CAKE",
    value: "5.00",
    type: "deposit",
    hasWithdraw: true,
  },
  {
    icon: Paypal,
    name: "PAYPAL",
    value: "5.00",
    type: "deposit",
    hasWithdraw: true,
  },
  {
    icon: BITP,
    name: "BITP",
    value: "50.00",
    type: "swap",
    hasWithdraw: false,
  },
  {
    icon: QIC,
    name: "Quest Credit",
    value: "5.00",
    type: "swap",
    hasWithdraw: false,
  },
];

const navs = ["DEPOSIT", "WITHDRAW", "SWAP"];

const Wallet = () => {
  const [isSwapOpen, setIsSwapOpen] = useState(false);

  const toggleSwap = () => {
    setIsSwapOpen(!isSwapOpen);
  };
  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto mt-16 px-4 lg:px-0 flex flex-col xl:flex-row justify-between">
        <div>
          <div className="flex gap-0.5">
            <div className="flex px-2 lg:px-8 lg:pr-14 rounded py-2 lg:py-4 items-center gap-2 lg:gap-20 bg-primary-1050 border-l border-t border-b border-primary-150">
              <USDG height="60" width="50" />
              <div>
                <div className="text-base lg:text-2xl font-bold text-primary-1100 text-right">
                  TOTAL BALANCE
                </div>
                <div className="text-base mt-2 lg:text-xl font-bold text-white text-right">
                  USDG <span className="text-base lg:text-2xl">33.00</span>
                </div>
              </div>
            </div>
            <div className="flex px-2 lg:px-8 py-2 lg:py-4 items-center gap-2 lg:gap-20 border-l border-t border-b border-primary-550">
              <QC height="60" width="50" />
              <div>
                <div className="text-base lg:text-2xl font-bold text-primary-1100 text-right">
                  QUEST CREDIT
                </div>
                <div className="text-base mt-2 lg:text-2xl font-bold text-white text-right">
                  5.00
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 w-full xl:w-table">
            <div className="grid grid-cols-4 xl:grid-cols-5 gap-0 font-bold lg:text-base text-sm text-primary-1100">
              <div className="mr-20 hidden xl:block">COIN</div>
              <div className="mr-20 whitespace-nowrap">COIN NAME</div>
              <div className="mr-20 xl:hidden">BALANCE</div>
              <div className="mr-20"></div>
              <div className="xl:mr-20">ACTION</div>
              <button
                onClick={toggleSwap}
                className="bg-secondary-300 hidden xl:block font-bold text-white h-10 px-20 lg:px-10 rounded"
              >
                SWAP
              </button>
            </div>
            <div className="mt-7">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 py-5 border-b border-primary-550 items-center gap-0 font-medium lg:text-xl text-base text-white"
                >
                  <Image
                    priority={true}
                    height={50}
                    width={60}
                    src={item.icon}
                    alt="icon"
                    className="hidden xl:block"
                  />
                  <div>{item.name}</div>
                  <div className="text-right lg:text-left lg:ml-10">
                    {item.value}
                  </div>
                  <div className="relative">
                    <Link href='/deposit'>
                      <button
                        className={`${
                          item.type === "deposit"
                            ? "bg-secondary-150"
                            : "bg-secondary-300"
                        } font-bold text-white ml-10 xl:ml-0 h-7 lg:h-9 px-1 lg:px-2 w-16 lg:w-24 lg:text-sm ten`}
                        onClick={
                          item.type !== "deposit" ? toggleSwap : () => console.log()
                        }
                      >
                        {item.type === "deposit" ? "DEPOSIT" : "SWAP"}
                      </button>
                      <div className="xl:bg-primary-50 bg-primary-100 h-3 w-6 absolute rotate-45 -top-1.5 md:right-9 lg:right-14 xl:right-7 -right-10" />
                    </Link>
                  </div>
                  {item.hasWithdraw && (
                    <Link href='/withdraw'>
                      <button
                        className={`font-bold xl:ml-10 hidden xl:block text-sm text-white border-2 border-secondary-150 h-7 lg:h-9 ten px-1 lg:px-2 w-16 lg:w-24`}
                      >
                        WITHDRAW
                      </button>
                    </Link>
                  )}
                  {item.hasWithdraw && (
                    <Link href={"/withdraw"}>
                      <button
                        className={`font-bold xl:hidden text-sm text-white bg-secondary-350 h-7 lg:h-9 ten px-1 lg:px-2 w-16 lg:w-24`}
                      >
                        WITHDRAW
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-14 xl:mt-0">
          <h3 className="xl:text-2xl text-lg font-bold text-white text-left">
            TRANSACTION HISTORY
          </h3>
          <div className="flex items-center gap-32 mt-6">
            <div className="flex items-center gap-8">
              {navs.map((item, index) => (
                <div
                  className="text-sm xl:text-lg font-bold text-primary-450"
                  key={index}
                >
                  {item}
                </div>
              ))}
            </div>
            <Filter />
          </div>
          <div className="xl:mt-40 mt-32 flex justify-center">
            <EmptyTransaction />
          </div>
        </div>
      </div>
      <Modal
        key={0}
        Body={Swap}
        isOpen={isSwapOpen}
        close={toggleSwap}
        isVoid={5}
      />
      <Footer />
    </div>
  );
};

export default Wallet;
