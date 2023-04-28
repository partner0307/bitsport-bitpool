import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { Header } from "@/components";
import Select from "@/components/Select";
import USDT from "@/public/usdt.png";
import QIC from "@/public/qc.png";
import Paypal from "@/public/paypal.png";
import BUSD from "@/public/busd.png";
import BITP from "@/public/bitp.png";

const DynamicQRCode = dynamic(() => import("@/components/QrCode"), {
  ssr: false,
});
import { EmptyTransaction, Refresh } from "@/public/icons";
import classNames from "classnames";
import { useState } from "react";
import Footer from "@/components/Footer";

const items = [
  {
    icon: BUSD,
    name: "BUSD",
  },
  {
    icon: USDT,
    name: "USDT",
  },
  {
    icon: Paypal,
    name: "USD",
  },
  {
    icon: BITP,
    name: "BITP",
  },
  {
    icon: QIC,
    name: "Quest Credit",
  },
];

const networks = [
  {
    name: "ETHEREUM",
  },
  {
    name: "BNB CHAIN",
  },
  {
    name: "TRON",
  },
];

const navs = ["COIN", "AMOUNT", "ADDRESS", "TIME"];

const Deposit = () => {
  const [coin, setCoin] = useState("BUSD");
  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto px-4 lg:px-0">
        <div className="mt-16 lg:px-20 xl:px-40 grid grid-cols-1 lg:grid-cols-2 lg:gap-32 justify-center">
          <div>
            <div className="flex items-center gap-20">
              <h2 className="text-white font-bold text-2xl">DEPOSIT</h2>
              <button className="flex lg:hidden bg-secondary-450 px-6 py-2 rounded-lg items-center text-white gap-3 font-bold text-base">
                <div>REFRESH</div>
                <Refresh />
              </button>
            </div>
            <div className="mt-10">
              <Select
                key={0}
                name={items[0].name}
                icon={items[0].icon}
                handleChange={(value) => setCoin(value)}
                items={items}
                label="SELECT COIN"
              />

              {coin !== "USD" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Select
                    key={1}
                    name={networks[0].name}
                    handleChange={(value) => console.log(value)}
                    items={networks}
                    label="SELECT NETWORK"
                  />

                  <Select
                    key={2}
                    name={"0x8bcda8975c42105fd3f57b88956b511f1ff17da1"}
                    label="ADDRESS"
                    hasCopy
                  />
                </motion.div>
              )}

              {coin === "USD" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={classNames(
                      "text-primary-1100 font-bold lg:text-base text-sm mb-1"
                    )}
                  >
                    AMOUNT
                  </div>
                  <motion.input
                    type="number"
                    className="rounded w-full font-medium text-lg text-white px-5 xl:px-8 h-16 bg-secondary-400 outline-none"
                  />
                </motion.div>
              )}

              <div className="mt-14">
                <DynamicQRCode qrValue="0x8bcda8975c42105fd3f57b88956b511f1ff17da1" />
              </div>
            </div>
          </div>
          <div>
            <button className="mb-12 hidden lg:flex bg-secondary-450 px-8 py-3 rounded items-center text-white gap-3 font-bold text-lg">
              <div>REFRESH</div>
              <Refresh />
            </button>
            <p className="font-medium text-base text-white">
              • We require minimum 3 confirmations to complete the transaction.
              On average, each confirmation takes about 15 minutes. It can take
              more time depending on the PayPal network so do not worry and wait
              quietly.
            </p>
            <div className="text-white lg:mt-14 mt-10 underline font-bold text-lg">
              DEPOSIT HASN’T ARRIVED? Click here
            </div>
            <div className="lg:mt-14 mt-10 flex justify-between w-full">
              <div>
                <p className="text-base text-primary-1100 font-bold">
                  MINIMUM DEPOSIT
                </p>
                <p className="mt-2 text-white font-medium text-base">
                  MORE THAN 0.01 BUSD
                </p>
              </div>
              <div>
                <p className="text-base text-primary-1100 font-bold">
                  Expected arrival time
                </p>
                <p className="mt-2 text-white font-medium text-base">
                  LESS THAN 1 minute{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:px-14 xl:px-28">
          <div className="mt-14">
            <h3 className="xl:text-2xl text-lg font-bold text-white text-left">
              TRANSACTION HISTORY
            </h3>
            <div className="flex items-center gap-32 mt-6">
              <div className="grid grid-cols-4 items-center gap-20 xl:gap-28">
                {navs.map((item, index) => (
                  <div
                    className={classNames(
                      "text-xs xl:text-sm font-bold text-primary-450",
                      {
                        "col-span-1": item === "ADDRESS",
                      }
                    )}
                    key={index}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-20 flex w-full justify-center">
              <EmptyTransaction />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Deposit;
