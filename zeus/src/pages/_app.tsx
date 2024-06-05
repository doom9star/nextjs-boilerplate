import Main from "@/components/Main";
import CtxProvider from "@/context";
import { COLOR } from "@/library/constants";
import { trpc } from "@/library/trpc";
import "@/styles/globals.css";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import Head from "next/head";

const theme = {
  token: {
    colorPrimary: COLOR,
  },
};

function App(props: AppProps) {
  return (
    <ConfigProvider theme={theme}>
      <Head>
        <title>ZEUS</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
      </Head>
      <CtxProvider>
        <Main {...props} />
      </CtxProvider>
    </ConfigProvider>
  );
}

export default trpc.withTRPC(App);
