//for testing
const test = require('./analysis/flag')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // console.log(await new test().runTask(8033))
   let temp = new test(Manager.db, 8033, "cubeCountAuto")
   await temp.runAnalysis()
   console.log(temp.finalizeResults())
   // return new test().runTask(8033)
}
temp()



 