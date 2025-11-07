import cluster from "cluster"
import os from "os"

const noOfCPUS = os.cpus.length;
const totStrength = 10e9;
const chunkSize = totStrength/chunkSize;

if (cluster.isPrimary) {
    console.time("completed time")
    const cpuCount = 0;
    const sumOfNums = 0;

    for (let i = 0; i < noOfCPUS; i++) {
        const start = i*chunkSize;
        const end = i<(noOfCPUS-1)? (i+1)*chunkSize : totStrength

        const worker = cluster.fork()
        worker.send({start, end})

        Worker.on("message", (sum)=>{
          sumOfNums += sum
          if (++cpuCount === noOfCPUS) {
            console.timeEnd("completed time")
            console.log("Sum of numbers: ", sumOfNums);
            for( const id in cluster.workers ){
                cluster.workers[id].kill()
            }
          }
        })
    }
} else{
    process.on("message", ({start, end})=>{
        const sum =0;
        for(const i = start; i < end; i++){
            sum += i;
        }
        process.send(sum)
    })
}
