//for testing
const test = require('./analysis/general/penalties')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let x = new test(Manager.db)
   await x.runAnalysis()
   console.log(x.finalizeResults())
   // return new test().runTask(8033)
}
temp()



 