//for testing
// const test = require('./analysis/general/scoringBreakdown')
// const test = require('./analysis/teleop/cargo/cargoCountOverview')
const test = require('./manager/GetTournamentKey')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, "2023cafr", 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
   // var x = new test(Manager.db, 8033, 0, 2)
//   await x.runAnalysis()
   let x = await new test().runTask()
 console.log(x)
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
//2022cc_qm34_5 2813
