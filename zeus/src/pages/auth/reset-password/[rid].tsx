import { useCtx } from "@/context";
import { setAlert, setUser } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { Button, Form, Input, Typography } from "antd";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoLockClosedOutline } from "react-icons/io5";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = trpc.auth.reset.useMutation();

  const router = useRouter();
  const params = useParams();
  const {
    state: { user },
    dispatch,
  } = useCtx();
  const { handler } = useError();

  const rid = user?.id ? `${user.id}-user` : (params.rid as string);

  const onSubmit = useCallback(
    (values: any) => {
      setLoading(true);
      dispatch(setAlert(null));
      mutateAsync({ rid, password: values.password })
        .then((data) => {
          if (data.status === 200) {
            if (rid.includes("-user")) {
              dispatch(setUser({ ...user!, password: values.password }));
              router.replace("/home/feed");
            } else {
              router.replace("/");
            }
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
    },
    [rid, user]
  );

  return (
    <div className="w-full h-full flex flex-col justify-center lg:w-3/4 mx-auto">
      <Typography.Title level={4} className="flex items-center py-8">
        <IoLockClosedOutline className="mr-2" /> Reset Password
      </Typography.Title>
      <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={onSubmit}>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password autoFocus />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please input your password again!" },
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
  );
}
