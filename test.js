//for testing
const test = require('./analysis/breakdownMetrics')
// const test = require('./analysis/teleop/cargo/cargoCountOverview')
// const test = require('./analysis/suggestionsInner.js')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, 8033 ,0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
   var x = new test(Manager.db, 971)
   // var x = new test(Manager.db, 8033, 971, 668, "ql")
  await x.runAnalysis()
 
 console.log(x.finalizeResults())
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
//2022cc_qm34_5 2813
 