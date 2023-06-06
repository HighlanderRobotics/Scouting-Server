//for testing
const test = require('./analysis/teamAndMatch')
// const test = require('./analysis/teleop/cargo/cargoCountOverview')
// const test = require('./analysis/suggestionsInner')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, "2023gal", 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
   var x = new test(Manager.db, 8033, "2023gal_qm1_4")
   // var x = new test(Manager.db, 8048, 7777, 2135, 2643, 6822, 8262, "qm")
  await x.runAnalysis()
 
 console.log(x.finalizeResults().result.metrics.autoPath)
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
///API/analysis/suggestions?red1=8048&red2=7777&red3=2135&blue1=2643&blue2=6822&blue3=8262&matchType=qm

 