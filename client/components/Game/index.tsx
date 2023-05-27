import { Header } from "@/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IState } from "@/store";
import { notification } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
import FullScreen from "@/public/full-screen.svg";

export default function GameComponent() {
  const [uid, setUid] = useState(0);
  const [cid, setCid] = useState(0);
  const router = useRouter();
  const { currentUser } = useSelector((state: IState) => state.auth);

  const requestFullScreen = () => {
    const elem: any = document.getElementById("iframe");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  useEffect(() => {
    if (!currentUser) {
      notification.warning({
        message: "Warning!",
        description: "Please Login!",
      });
      router.push("/");
    }

    const getFromLocalStorage = (key: string) => {
      if (!key || typeof window === "undefined" || !localStorage) {
        return "";
      }
      return window.localStorage.getItem(key);
    };

    const cid: any = getFromLocalStorage("cid");
    setCid(Number(cid));
    setUid(Number(currentUser.index));
  }, [currentUser]);

  return (
    <div className="w-full absolute xl:relative top-0 left-0 h-full">
      <Header />

      <div className="min-h-90vh w-full bg-white relative">
        <Image
          priority={true}
          height={75}
          width={79}
          src={FullScreen}
          alt="full screen"
          className="cursor-pointer z-50 absolute bottom-10 right-0"
          onClick={requestFullScreen}
        />
        {uid && cid && (
          <iframe
            src={`https://portal.bitpool.gg/?c=${cid}&u=${uid}`}
            id="iframe"
            className="w-full absolute top-0 left-0 h-full"
          ></iframe>
        )}
      </div>
    </div>
  );
}
