

(()=>{
   let sum = 0;
   console.time("Calculation Time");
   const totalIterations = 1e8;
   for (let I = 0; I < totalIterations; I++) {
     sum += I
   }

   const endTime = Date.now();
   console.timeEnd("Calculation Time");
   
   console.log(sum);
   
})();