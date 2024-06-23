import Navbar from "@/components/Navbar";
import { PrivateRoute } from "@/components/Route";

export default function Feed() {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="w-3/4 mx-auto"></div>
    </PrivateRoute>
  );
}
