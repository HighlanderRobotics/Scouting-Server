//for testing
// const test = require('./analysis/categoryMetrics')
const test = require('./analysis/picklistShell')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   var x = new test(Manager.db, "2023cafr", 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
   // var x = new test(Manager.db, 2813, 8033, 4414)
  await x.runAnalysis()
 console.log(x.finalizeResults())
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
//2022cc_qm34_5 2813
