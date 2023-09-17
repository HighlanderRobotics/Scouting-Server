//for testing
const test = require('./analysis/picklistShell')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let temp = new test(Manager.db, "2023gal", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ["trend", "ranking"])
   await temp.runAnalysis()
   console.log(temp.finalizeResults().result[0].flags)
   // return new test().runTask(8033)
   // await new test().runTask()

}
temp()



 