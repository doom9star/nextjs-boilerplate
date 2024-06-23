import { useCtx } from "@/context";
import { setUser } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { Avatar, Button, Menu, MenuProps, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { CgFeed } from "react-icons/cg";

export default function Navbar() {
  const router = useRouter();

  const [current, setCurrent] = useState<string>(
    router.pathname.split("/").slice(-1)[0]
  );
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = trpc.auth.logout.useMutation();

  const {
    state: { user },
    dispatch,
  } = useCtx();
  const { handler } = useError();

  const navItems: MenuProps["items"] = useMemo(() => {
    const items = [{ key: "feed", label: "Feed", icon: <CgFeed /> }];

    return items;
  }, [current]);

  const onLogout = useCallback(() => {
    setLoading(true);
    mutateAsync()
      .then((data) => {
        if (data.status === 200) {
          dispatch(setUser(null));
        } else handler(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex items-center p-8">
      <Modal
        open={logout}
        title="Logout"
        onCancel={() => setLogout(false)}
        okText="Logout"
        confirmLoading={loading}
        onOk={onLogout}
      >
        <span className="text-xs">Are you sure that you want to logout?</span>
      </Modal>
      <Avatar
        className="w-24 h-24 mr-2 hover:opacity-90 cursor-pointer"
        src={"/images/favicon.ico"}
        onClick={() => router.push("/")}
      />
      <Menu
        items={navItems}
        selectedKeys={[current]}
        mode="horizontal"
        onClick={(e) => {
          setCurrent(e.key);
          router.push(`/home/${e.key}`);
        }}
        className="w-[640px]"
      />
      <div className="flex items-center ml-auto">
        <div className="flex flex-col items-center">
          <Link
            href={`/home/user/${user?.name}`}
            className="no-underline text-black flex flex-col items-center cursor-pointer"
          >
            {user?.avatar ? (
              <Avatar className="w-12 h-12 hover:opacity-90" />
            ) : (
              <AiOutlineUser className="text-4xl" />
            )}
            <div className="flex items-center mb-2 mt-1">
              <span className="hover:underline" style={{ fontSize: "0.7rem" }}>
                @{user?.name}
              </span>
            </div>
          </Link>
          <div className="flex">
            <Button
              className="text-xs"
              icon={<AiOutlineLogout />}
              onClick={() => setLogout(true)}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
