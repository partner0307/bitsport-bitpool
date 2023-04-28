import Image from "next/image";
import { motion, Variants } from "framer-motion";

import PoolLogo from "@/public/pool-logo.png";
import Profile from "@/public/profile.png";
import {
  Ball,
  Cancel,
  Contact,
  Dapp,
  Leaderboard,
  News,
  Nft,
  OfficialLogo,
  Tutorial,
  ArrowDown,
  QC,
  USDG,
} from "@/public/icons";
import Link from "next/link";
import Button, { variantTypes } from "../Button";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { NoChallenge } from "../Header";

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

const items = [
  {
    title: "QUEST",
    icon: <Ball width={"28.014"} height={"28.014"} fill="#777786" />,
    url: "/",
  },
  {
    title: "NFT",
    icon: <Nft />,
    url: "/nft",
  },
  {
    title: "LEADERBOARD",
    icon: <Leaderboard />,
    url: "/leaderboard",
  },
  {
    title: "NEWS & EVENTS",
    icon: <News />,
    url: "/events",
  },
  {
    title: "TUTORIAL",
    icon: <Tutorial />,
    url: "#",
  },
  {
    title: "DAPP",
    icon: <Dapp />,
    url: "https://app.bitsport.gg/",
    isExternal: true,
  },
];

const DesktopNav = () => {
  return (
    <motion.nav
      animate={"open"}
      transition={{ ease: "easeOut", duration: 2 }}
      className="hidden xl:max-h-screen xl:overflow-auto xl:flex xl:flex-col xl:justify-start xl:items-center bg-primary-200 small-border-r xl:border-r-primary-150 p-6"
    >
      <Image
        priority={true}
        height={87}
        width={78}
        src={PoolLogo}
        alt="bitpool logo"
      />

      <motion.div variants={variants} className="flex flex-col gap-12 mt-10">
        {items.map((item) => (
          <motion.div variants={itemVariants} key={item.title}>
            {!item.isExternal ? (
              <Link
                href={item.url}
                className="flex gap-2 flex-col duration-300 justify-center text-primary-700 hover:text-white items-center nav-link"
              >
                {item.icon}
                <p className="text-sm font-semibold text-center">
                  {item.title}
                </p>
              </Link>
            ) : (
              <a
                href={item.url}
                target="_blank"
                className="flex gap-2 flex-col duration-300 justify-center text-primary-700 hover:text-white items-center nav-link"
              >
                {item.icon}
                <p className="text-sm font-semibold text-center">
                  {item.title}
                </p>
              </a>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-20">
        <Contact />
      </div>
    </motion.nav>
  );
};

const MobileNav = ({ open, close }: { open: boolean; close: () => void }) => {
  const [isOpen, setIsOpen] = useState(open);
  const [loggedIn, setLoggedIn] = useState(true);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(!isOpen);
    setTimeout(() => {
      close();
    }, 200);
  };

  const toggleChallenge = () => {
    setIsChallengeOpen(!isChallengeOpen);
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <>
      <motion.nav
        animate={isOpen ? "open" : "closed"}
        transition={{ ease: "easeOut", duration: 2 }}
        onClick={handleClose}
        className={`${
          open ? "fixed" : "hidden"
        } xl:hidden z-30 left-0 top-0 mobile-nav-container`}
      >
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          exit={{ opacity: isOpen ? 0 : 1 }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="p-5 z-50 mobile-nav bg-primary-800 max-h-screen h-screen overflow-y-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <Image
              priority={true}
              height={53.75}
              width={65.39}
              src={PoolLogo}
              alt="pool logo"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">BITPOOL</h1>
              <div className="flex items-center justify-center gap-1">
                <OfficialLogo size="15" />
                <div className="text-primary-300 text-xs pt-0.5 font-Poppins">
                  Official Page
                </div>
              </div>
            </div>
            <motion.div whileTap={{ scale: 0.97 }} onClick={handleClose}>
              <Cancel />
            </motion.div>
          </div>
          <div className="mt-10 flex flex-col justify-center items-center gap-5">
            {loggedIn && (
              <div className="flex flex-col justify-center items-center">
                <Image
                  priority={true}
                  height={75}
                  width={79}
                  src={Profile}
                  alt="profile"
                  className="cursor-pointer"
                />
                <h4 className="text-center font-bold text-lg text-primary-450 mt-2">
                  BITSPORT_ADMIN
                </h4>
              </div>
            )}
            <Button
              variant={variantTypes.outline}
              px="px-8"
              text="Create Challenge"
              onClick={toggleChallenge}
            />

            <div className="flex items-center">
              <Link href="/wallet">
                <div className="cursor-pointer px-1 py-4 flex items-center gap-1 bg-primary-950 rounded-l h-12">
                  <USDG width="15.194" height={"19.075"} />
                  <div className="font-medium text-xs text-white font-Poppins">
                    33 USDG
                  </div>
                  <div>
                    <QC width={"15.759"} height={"19.569"} />
                  </div>
                  <div className="font-medium flex text-xs text-white font-Poppins">
                    5 QC
                  </div>
                </div>
              </Link>
              <div className="cursor-pointer relative px-3 py-4 justify-center items-center bg-primary-1000 rounded-br h-12">
                <div className="pt-1.5">
                  <ArrowDown />
                </div>
                <div className="h-9 w-9 bg-primary-800 rotate-45 -top-5 -right-7 absolute"></div>
              </div>
            </div>
          </div>
          <motion.div
            variants={variants}
            className="flex flex-col gap-12 mt-10"
          >
            {items.map((item) => (
              <motion.div variants={itemVariants} key={item.title}>
                {!item.isExternal ? (
                  <Link
                    href={item.url}
                    className="flex gap-4 duration-300 text-primary-700 hover:text-white items-center nav-link"
                  >
                    {item.icon}
                    <p className="xl:text-sm text-base font-semibold text-center">
                      {item.title}
                    </p>
                  </Link>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    className="flex gap-4 duration-300 text-primary-700 hover:text-white items-center nav-link"
                  >
                    {item.icon}
                    <p className="xl:text-sm text-base font-semibold text-center">
                      {item.title}
                    </p>
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.nav>

      <Modal
        key={2}
        Body={NoChallenge}
        isOpen={isChallengeOpen}
        close={toggleChallenge}
        isVoid
      />
    </>
  );
};

export { DesktopNav, MobileNav };
