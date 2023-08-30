//for testing
const test = require('./analysis/categoryMetrics')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let x = new test(Manager.db, 8033)
   await x.runAnalysis()
   console.log(x.finalizeResults())
}
temp()



 