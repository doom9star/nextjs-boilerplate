import { SandboxedJob } from "bullmq";
import { sockets } from "../library/constants";
import { BACKUP } from "./jobs";

export default async function (job: SandboxedJob) {
  console.log(`[${new Date().toLocaleTimeString()}] ${job.name} is executing.`);

  switch (job.name) {
    case BACKUP: {
      console.log("backup is completed!");
      break;
    }
    default: {
      console.log("job is invalid!");
      break;
    }
  }

  console.log(`[${new Date().toLocaleTimeString()}] ${job.name} is finished.`);
}
