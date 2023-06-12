//for testing
const test = require('./manager/addMatch')
// const test = require('./analysis/teleop/cargo/cargoCountOverview')
// const test = require('./analysis/suggestionsInner')
const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, "2023gal", 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
   let x = await new test().runTask({tournamentKey : "2023gal", teams : [8033, 234, ,24, 342, 54,35 ]})
   // console.log(x[x.length-1])
   // var x = new test(Manager.db, 8048, 7777, 2135, 2643, 6822, 8262, "qm")
 
//  console.log(x.finalizeResults())
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
///API/analysis/suggestions?red1=8048&red2=7777&red3=2135&blue1=2643&blue2=6822&blue3=8262&matchType=qm

 