import { sockets } from "@/library/constants";
import { AuthIORequest } from "@/library/types";
import { Router } from "express";

export const IORouter = (socket: AuthIORequest) => {
  socket.on("connection", (s: AuthIORequest) => {
    const userId = parseInt(s.handshake.user!.id);
    sockets.set(userId, s);

    console.log(`[CONNECTION] - ${userId}`);

    socket.on("disconnect", () => sockets.delete(userId));
  });
};

const RERouter = Router();
RERouter.get("/", (_, res) => res.send("Hi from Apollo!"));

export default RERouter;
