//for testing
const test = require('./analysis/trend')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let x = new test(Manager.db, 1678)
   await x.runAnalysis()
   console.log(x.finalizeResults())
}
temp()



 