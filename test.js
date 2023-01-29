//for testing

const Manager = require('./manager/dbmanager')
const test = require('./analysis/picklistShell')

// const y = require("./test")
async function temp() {
   var x = new test(Manager.db, "2022cc", 0.7, 0.2, 0.5, 0.0, 0.0, 0.9, 0.5, 0.5, 0.5, 0.4)
  // var x = new test(Manager.db,1700)
  await x.runAnalysis()
 console.log(x.finalizeResults())
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
//2022cc_qm34_5 2813
