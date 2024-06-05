import "module-alias/register";
import { BACKUP } from "@/bull/jobs";
import queue from "@/bull/queue";
import { IOAuth } from "@/middleware/io";
import RERouter, { IORouter } from "@/routes";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";

async function main() {
  dotenv.config({ path: "./.env" });

  await queue.add(
    BACKUP,
    {},
    {
      repeat: {
        // 12.00 AM (everyday)
        pattern: "0 0 0 * * *",
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  const app = express();
  app.use(cors({ origin: process.env.ZEUS, credentials: true }));
  app.use("/", RERouter);

  const httpServer = http.createServer(app);

  const IO = new Server(httpServer, {
    cors: { origin: process.env.ZEUS, credentials: true },
  });
  IO.use(IOAuth);
  IORouter(IO as any);

  httpServer.listen(process.env.PORT, () =>
    console.log(`Apollo listening on http://localhost:${process.env.PORT}`)
  );
}

main();
