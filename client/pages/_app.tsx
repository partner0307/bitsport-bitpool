import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { useRouter } from 'next/router'
import { DesktopNav } from "@/components/Nav";

import store from '../store';

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentUrl = router.asPath;

  useEffect(() => {
    if (currentUrl === '/game')
      document.getElementById('right-panel-container')?.classList.add('flow-y-none');
    else {
      document.getElementById('right-panel-container')?.classList.remove('flow-y-none');
    }
  }, [currentUrl])

  return (
    <Provider store={store}>
      <div className="flex xl:bg-primary-50 bg-primary-100 min-h-screen font-Rajdhani">
        <DesktopNav />
        <div className="max-h-screen overflow-auto w-full" id='right-panel-container'>
          <Component {...pageProps} />
        </div>
      </div>
    </Provider>
  );
}
