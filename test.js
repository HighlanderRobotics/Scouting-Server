//for testing

const Manager = require('./manager/dbmanager')
// const y = require("./test")

const test = require('./analysis/general/averageScore')
var x = new test(Manager.db, 254, 0, 3)
x.runAnalysis()
let done = x.finalizeResults()
setTimeout(function() {
  }, 2000);

console.log(x.result)


  //8033, 715, 1690, 114, 1678, 6800
  //2022cc_qm19_3 2022cc_qm25_2	2022cc_qm1_1	2022cc_qm1_2 2022cc_qm2_0 2022cc_qm2_1 2022cc_qm14_1	2022cc_qm3_0	
  
