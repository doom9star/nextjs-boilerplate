import { useCtx } from "@/context";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { FaHome, FaUserPlus } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

export default function Index() {
  const {
    state: { user },
  } = useCtx();

  return (
    <div className="flex items-center justify-around h-full">
      <div className="flex flex-col">
        <span className="text-6xl font-montserrat">Title</span>
        <span className="text-xl p-2 font-montserrat">Subtitle</span>
      </div>
      <div className="flex flex-col items-center">
        <Image
          src={"/images/favicon.ico"}
          width={200}
          height={200}
          alt="logo"
          className="rounded-full"
        />
        <div className="my-8">
          {user ? (
            <Link href={"/home/feed"}>
              <Button className="text-xs" icon={<FaHome size={10} />}>
                Home
              </Button>
            </Link>
          ) : (
            <Fragment>
              <Link href={"/auth/login"}>
                <Button className="mr-2 text-xs" icon={<FiLogIn size={10} />}>
                  Login
                </Button>
              </Link>
              <Link href={"/auth/register"}>
                <Button
                  type="primary"
                  className="text-xs"
                  icon={<FaUserPlus size={10} />}
                >
                  Register
                </Button>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
