import Alert from "@/components/Alert";
import { useCtx } from "@/context";
import { setUser } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { useSocket } from "@/hooks/useSocket";
import { trpc } from "@/library/trpc";
import { Spin } from "antd";
import type { AppProps } from "next/app";
import { Fragment, useEffect, useState } from "react";

export default function Main({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true);

  const { refetch } = trpc.user.auth.useQuery();

  const { dispatch } = useCtx();
  const { handler } = useError();

  useSocket();

  useEffect(() => {
    setLoading(true);
    refetch()
      .then(({ data }) => {
        if (data?.status === 200) {
          dispatch(setUser(data.data as any));
        } else handler(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Spin />
        </div>
      ) : (
        <Fragment>
          <Alert />
          <Component {...pageProps} />
        </Fragment>
      )}
    </div>
  );
}
