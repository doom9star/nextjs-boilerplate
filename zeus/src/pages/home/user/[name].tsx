import { PrivateRoute } from "@/components/Route";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { TUser } from "@/library/types";
import { Avatar, Button, Spin } from "antd";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";

export default function UserDetail() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<TUser | null>(null);

  const params = useParams<{ name: string }>();

  const { refetch } = trpc.user.detail.useQuery({ name: params.name });

  const router = useRouter();
  const { handler } = useError();

  useEffect(() => {
    setLoading(true);
    refetch()
      .then(({ data }) => {
        if (data?.status === 200) {
          setUser(data.data as any);
        } else {
          handler(data);
          router.back();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <PrivateRoute>
      <div className="w-3/4 mx-auto">
        {loading ? (
          <div className="mt-10 flex items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="my-20 flex flex-col font-montserrat">
            <IoMdArrowBack
              className="text-gray-600 mb-4 cursor-pointer"
              onClick={() => router.back()}
            />
            <div className="flex flex-col items-center">
              {user?.avatar ? (
                <Avatar
                  className="w-24 h-24 border-2 bg-white border-solid border-white shadow-md absolute left-10 -bottom-10"
                  src={user?.avatar.url}
                />
              ) : (
                <AiOutlineUser className="text-6xl" />
              )}
              <span className="font-bold text-lg mr-2">{user?.username}</span>
              <span className="text-xs mb-1 text-gray-600">@{user?.name}</span>
              <Button
                className="text-xs"
                icon={<FaEdit />}
                onClick={() => router.push("/home/user/edit")}
              />
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
}
