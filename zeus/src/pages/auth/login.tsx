import { PublicRoute } from "@/components/Route";
import { useCtx } from "@/context";
import { setAlert, setUser } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { Button, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { IoMdArrowBack } from "react-icons/io";

type TInfo = {
  emailOrName: string;
  password: string;
};

export default function Login() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = trpc.auth.login.useMutation();

  const { handler } = useError();
  const { dispatch } = useCtx();
  const router = useRouter();

  const onLogin = useCallback((info: TInfo) => {
    setLoading(true);
    dispatch(setAlert(null));
    mutateAsync(info)
      .then((data) => {
        if (data.status === 200) {
          dispatch(setUser(data.data));
        } else handler(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicRoute>
      <div className="w-full h-full flex flex-col justify-center lg:w-3/4 mx-auto">
        <IoMdArrowBack
          className="text-gray-600 mb-4 cursor-pointer"
          onClick={() => router.back()}
        />
        <Typography.Title level={4} className="flex items-center py-8">
          <AiOutlineLogin className="mr-2" /> Login
        </Typography.Title>
        <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onLogin}>
          <Form.Item
            label="Email/Name"
            name="emailOrName"
            rules={[
              { required: true, message: "Please input your email/name!" },
            ]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Typography.Text className="text-xs flex items-center justify-end">
            <span className="mr-1">Forgot password?</span>
            <Link href={"/auth/forgot-password"}>
              <span className="underline font-bold text-customred">reset</span>
            </Link>
          </Typography.Text>
          <Form.Item className="flex justify-end mt-12">
            <Typography.Text className="text-xs">
              <span className="mr-1">New here?</span>
              <Link href={"/auth/register"}>
                <span className="underline font-bold text-customred">
                  register
                </span>
              </Link>
            </Typography.Text>
            <Button
              type="primary"
              className="text-xs ml-4"
              icon={<FiLogIn size={10} />}
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PublicRoute>
  );
}
