//for testing
const test = require('./analysis/pitScouting')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let x = new test(Manager.db, 11)
   await x.runAnalysis()
   console.log(x.finalizeResults())
   // return new test().runTask(8033, "yes", "swerve", 10, 10)
}
temp()



 