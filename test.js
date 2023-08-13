//for testing
const test = require('./analysis/general/scoringBreakdown')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, "2023gal", 0, 0.0, 0. , 0.0, 0.0, 0.0, 0.0, 1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
   let x = new test(Manager.db, 3467, 1, "2023gal", 105, "qm" )
   await x.runAnalysis()
   // let temp = await new test().runTask(124, "test", [8033, 1323])
   console.log(x.finalizeResults())
}
temp()



 