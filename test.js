//for testing
const test = require('./analysis/teamAndMatch')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   // var x = new test(Manager.db, "2023gal", 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
   let x = new test(Manager.db, 8033, '2023gal_qm10_1')
   await x.runAnalysis()
  //  let temp = await new test().runTask({tournamentKey :"2023gal"})
   console.log()
}
temp()



 