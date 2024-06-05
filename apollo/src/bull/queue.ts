import { QUEUE } from "@/library/constants";
import { Queue, Worker } from "bullmq";
import path from "path";

const queue = new Queue(QUEUE);

new Worker(QUEUE, path.join(__dirname, "worker.js"), {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export default queue;
