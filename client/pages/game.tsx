import { Header } from "@/components";
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Home() {
  const [uid, setUid] = useState(0);
  const [cid, setCid] = useState('');


  useEffect(() => {
    const getFromLocalStorage = (key: string) => {
      if (!key || typeof window === "undefined" || !localStorage) {
        return "";
      }
      return window.localStorage.getItem(key);
    };

    const cid: any = getFromLocalStorage("cid");
    const uid: any = Cookies.get('uid');
    setCid(cid);
    setUid(uid);
  }, []);

  return (
    <div className="w-full">
      <Header />

      <div className="min-h-90vh w-full game-dashboard">

      {uid && cid && <iframe src={`https://portal.bitpool.gg/?c=${cid}&u=${uid}`} frameBorder="0" className="game-iframe" id="iframe"></iframe>}

      </div>
    </div>
  );
}
