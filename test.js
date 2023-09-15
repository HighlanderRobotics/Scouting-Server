//for testing
const test = require('./manager/addEPA')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // let temp = new test(Manager.db, 8033, ["trend", "ranking"], "2023gal")
   // await temp.runAnalysis()
   // console.log(temp.finalizeResults())
   // return new test().runTask(8033)
   await new test().runTask()

}
temp()



 