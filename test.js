//for testing

const Manager = require('./manager/dbmanager')
const test = require('./analysis/auto/cargo/cargoCountAuto')

// const y = require("./test")
async function temp() {
  var x = new test(Manager.db, 254, 0, 10000)
 await x.runAnalysis()

  console.log(x.finalizeResults().array)
}
temp()


  //8033, 715, 1690, 114, 1678, 6800
  //2022cc_qm19_3 2022cc_qm25_2	2022cc_qm1_1	2022cc_qm1_2 2022cc_qm2_0 2022cc_qm2_1 2022cc_qm14_1	2022cc_qm3_0	

