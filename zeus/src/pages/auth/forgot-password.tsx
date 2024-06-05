import { PublicRoute } from "@/components/Route";
import { useCtx } from "@/context";
import { setAlert } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { Button, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";
import { IoLockClosedOutline } from "react-icons/io5";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = trpc.auth.forgot.useMutation();

  const router = useRouter();
  const { dispatch } = useCtx();
  const { handler } = useError();

  const onSubmit = useCallback((values: any) => {
    setLoading(true);
    dispatch(setAlert(null));
    mutateAsync(values)
      .then((data) => {
        if (data.status === 200) {
          router.replace("/");
          dispatch(
            setAlert({
              type: "success",
              message: data.message,
              description: data.description,
            })
          );
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
          <IoLockClosedOutline className="mr-2" /> Forgot Password
        </Typography.Title>
        <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item className="flex justify-end">
            <Typography.Text className="text-xs">
              <span className="mr-1">remember?</span>
              <Link href={"/auth/login"}>
                <span className="underline font-bold text-customred">
                  login
                </span>
              </Link>
            </Typography.Text>
            <Button
              type="primary"
              className="text-xs ml-4"
              icon={<AiOutlineMail size={10} />}
              loading={loading}
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PublicRoute>
  );
}
