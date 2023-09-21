//for testing
const test = require('./analysis/categoryMetrics')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let temp = new test(Manager.db, 8033)
   await temp.runAnalysis()
   
   console.log(temp.finalizeResults().result)

   // await new test().runTask('frc3603', '2023gal', {uuid : 6, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1'})
   // await new test().runTask(10)

}
temp()



 