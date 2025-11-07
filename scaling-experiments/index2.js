import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;
const totalIterations = 1e8;
const chunkSize = Math.floor(totalIterations / numCPUs);

if (cluster.isPrimary) {
  console.time("Calculation Time");
  let completed = 0;
  let totalSum = 0;

  for (let i = 0; i < numCPUs; i++) {
    const start = i * chunkSize;
    const end = (i === numCPUs - 1) ? totalIterations : start + chunkSize;

    const worker = cluster.fork();
    worker.send({ start, end });

    worker.on("message", (sum) => {
      totalSum += sum;
      if (++completed === numCPUs) {
        console.timeEnd("Calculation Time");
        console.log("Final Sum:", totalSum);
        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }
      }
    });
  }

} else {
  process.on("message", ({ start, end }) => {
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += i;
    }
    process.send(sum);
  });
}