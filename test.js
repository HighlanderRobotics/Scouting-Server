//for testing
// const test = require('./analysis/auto/bestAutoPaths')
// const test = require('./analysis/teleop/cargo/cargoCountOverview')
const test = require('./analysis/suggestions')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, 8033 ,0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
   // var x = new test(Manager.db, 8033, 0, 1)
   var x = new test(Manager.db, 8048, 2135, 7777, 2643, 6822, 8262, "qm")
  await x.runAnalysis()
 
 console.log(x.finalizeResults().redAlliance.teleop)
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476

 