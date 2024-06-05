import { PublicRoute } from "@/components/Route";
import { useCtx } from "@/context";
import { setAlert, setUser } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { Button, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";

type TInfo = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = trpc.auth.register.useMutation();

  const router = useRouter();
  const { dispatch } = useCtx();
  const { handler } = useError();

  const onRegister = useCallback((info: TInfo) => {
    const { confirmPassword, ...rinfo } = info;
    dispatch(setAlert(null));
    setLoading(true);

    mutateAsync(rinfo)
      .then((data) => {
        if (data.status === 200) {
          dispatch(setUser(data.data?.user));
          router.replace("/home");
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
          <AiOutlineUserAdd className="mr-2" /> Register
        </Typography.Title>
        <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onRegister}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
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
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your password again!",
              },
              ({ getFieldValue }) => ({
                validator: (_, value) => {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Passwords must match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Typography.Text className="text-xs">
              <span className="mr-1">Already a member?</span>
              <Link href={"/auth/login"}>
                <span className="underline font-bold text-customred">
                  login
                </span>
              </Link>
            </Typography.Text>
            <Button
              type="primary"
              className="text-xs ml-4"
              icon={<FaUserPlus size={10} />}
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
