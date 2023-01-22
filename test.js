//for testing

const Manager = require('./manager/dbmanager')
const test = require('./analysis/picklistOuter')

// const y = require("./test")
async function temp() {
  var x = new test(Manager.db, "2022cc", 0.7, 0.2, 0.5, 0.0, 0.0, 0.9, 0.5, 0.5)
 console.log(x.runAnalysis())
}
temp()


  //8033, 715, 1690, 114, 1678, 6800
  //2022cc_qm19_3 2022cc_qm25_2	2022cc_qm1_1	2022cc_qm1_2 2022cc_qm2_0 2022cc_qm2_1 2022cc_qm14_1	2022cc_qm3_0	

