import Navbar from "@/components/Navbar";
import { PrivateRoute } from "@/components/Route";
import { useCtx } from "@/context";
import { Button } from "antd";
import { useRouter } from "next/router";
import { FaLock } from "react-icons/fa";

export default function Settings() {
  const {
    state: { user },
  } = useCtx();
  const router = useRouter();

  return (
    <PrivateRoute>
      <Navbar />
      <div className="w-3/4 mx-auto">
        <Button
          className="text-xs ml-4"
          icon={<FaLock size={10} />}
          onClick={() => router.push(`/auth/reset-password/${user?.id}`)}
        >
          reset password
        </Button>
      </div>
    </PrivateRoute>
  );
}
