import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { DesktopNav } from "@/components/Nav";

import store from '../store';

import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="flex xl:bg-primary-50 bg-primary-100 min-h-screen font-Rajdhani">
        <DesktopNav />
        <div className="max-h-screen overflow-auto w-full">
          <Component {...pageProps} />
        </div>
      </div>
    </Provider>
  );
}
