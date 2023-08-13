//for testing
const test = require('./analysis/teamAndMatch')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, "2023gal", 0, 0.0, 0. , 0.0, 0.0, 0.0, 0.0, 1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
   let x = new test(Manager.db, 8033, "2023gal_qm38_2")
   await x.runAnalysis()
   // let temp = await new test().runTask(124, "test", [8033, 1323])
   console.log(x.finalizeResults().result.metrics.notes)
}
temp()



 