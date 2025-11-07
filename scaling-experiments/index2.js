import cluster from "cluster";
import os from "os";
import { Worker } from "worker_threads";

if (cluster.isPrimary) {
    console.log("I am primary");
    cluster.fork();
} else {
    console.log("I am secondary");

    const numCPUs = os.cpus().length;
    const totalIterations = 1e8;
    const chunkSize = Math.floor(totalIterations / numCPUs);
    let completed = 0;
    let totalSum = 0;

    console.time("Calculation Time");

    for (let i = 0; i < numCPUs; i++) {
        const start = i * chunkSize;
        const end = (i === numCPUs - 1) ? totalIterations : start + chunkSize;

        const worker = new Worker(`
            const { parentPort, workerData } = require('worker_threads');
            let partialSum = 0;
            for (let i = workerData.start; i < workerData.end; i++) {
                partialSum += i;
            }
            parentPort.postMessage(partialSum);
        `, { eval: true, workerData: { start, end } });

        worker.on("message", (partialSum) => {
            totalSum += partialSum;
            completed++;
            if (completed === numCPUs) {
                console.timeEnd("Calculation Time");
                console.log("Final Sum:", totalSum);
            }
        });

        worker.on("error", (err) => console.error("Worker error:", err));
    }
}