//for testing
// const test = require('./analysis/auto/bestAutoPaths')
// const test = require('./analysis/teleop/cargo/cargoCountOverview')
const test = require('./analysis/suggestionsInner')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, 8033 ,0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5)
   var x = new test(Manager.db, 8033, 5104, 2486, "qm")
   // var x = new test(Manager.db, 8048, 7777, 2135, 2643, 6822, 8262, "qm")
  await x.runAnalysis()
 
 console.log(x.finalizeResults().alliance.auto[0])
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
///API/analysis/suggestions?red1=8048&red2=7777&red3=2135&blue1=2643&blue2=6822&blue3=8262&matchType=qm

 