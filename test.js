//for testing

const Manager = require('./manager/dbmanager')
const test = require('./analysis/general/averageScore')
// const test = require('./analysis/picklistShell')

// const y = require("./test")
async function temp() {
  //  var x = new test(Manager.db, "2022cc", 0, 0, 0, 0, 0, 0, 0, 1, 0, 0)
   var x = new test(Manager.db, 2813, 1)
  await x.runAnalysis()
 console.log(x.finalizeResults())
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
//2022cc_qm34_5 2813
