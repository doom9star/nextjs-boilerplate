import { PrivateRoute } from "@/components/Route";
import { useCtx } from "@/context";
import { setUser } from "@/context/actionCreators";
import { useError } from "@/hooks/useError";
import { trpc } from "@/library/trpc";
import { getBase64 } from "@/library/utils/getBase64";
import { Button, Form, Input, Typography, Upload, UploadFile } from "antd";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { CiSaveUp2 } from "react-icons/ci";
import { IoMdArrowBack } from "react-icons/io";

export default function EditUser() {
  const [loading, setLoading] = useState(false);

  const {
    dispatch,
    state: { user },
  } = useCtx();

  const [avatar, setAvatar] = useState<UploadFile[]>(
    user?.avatar
      ? [
          {
            name: user.avatar.cid,
            uid: user.avatar.cid,
            url: user.avatar.url,
            thumbUrl: user.avatar.url,
          },
        ]
      : []
  );

  const { mutateAsync } = trpc.user.update.useMutation();

  const router = useRouter();
  const { handler } = useError();

  const onFinish = useCallback(
    async (values: any) => {
      setLoading(true);
      const _info = {
        ...values,
        avatar: avatar.length > 0 ? avatar[0].thumbUrl : "",
      };

      mutateAsync(_info)
        .then((data) => {
          if (data.status === 200) {
            dispatch(setUser(data.data));
            router.replace("/home");
          } else handler(data);
        })
        .finally(() => setLoading(false));
    },
    [user, avatar]
  );

  return (
    <PrivateRoute>
      <div className="w-full lg:w-3/4 mx-auto my-20">
        <IoMdArrowBack
          className="text-gray-600 mb-4 cursor-pointer"
          onClick={() => router.back()}
        />
        <Form
          initialValues={{
            name: user?.name,
            username: user?.username,
          }}
          labelCol={{ span: 8 }}
          labelAlign="left"
          className="m-4"
          onFinish={onFinish}
        >
          <Form.Item label="Avatar" name="avatar" required>
            <Upload
              listType="picture-card"
              fileList={avatar}
              previewFile={getBase64}
              onChange={({ fileList }) => setAvatar(fileList)}
              className="mb-8"
            >
              {avatar.length > 0 ? null : (
                <div className="flex flex-col items-center">
                  <AiOutlinePlus className="mb-2" />
                  <Typography.Text className="text-xs">Upload</Typography.Text>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input a name!" }]}
            className="mb-10"
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <div className="flex justify-end my-8">
            <Button
              type="primary"
              className="text-xs"
              htmlType="submit"
              loading={loading}
              icon={<CiSaveUp2 size={10} />}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </PrivateRoute>
  );
}
