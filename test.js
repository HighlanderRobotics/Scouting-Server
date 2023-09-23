//for testing
const test = require('./analysis/categoryMetrics')

const del = require('./manager/deleteData')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   let temp = new test(Manager.db, 8033)
   await temp.runAnalysis()
   console.log(temp.finalizeResults())
   // console.log(await new test().runTask(8033))
   
   // // // console.log(temp.finalizeResults().result)

   // await new del().runTask(1)
   // await new del().runTask(2)

   // await new del().runTask(3)

   // await new del().runTask(4)

   // await new del().runTask(5)

   // await new del().runTask(6)
   // await new test().runTask('frc67', '2023gal', {uuid : 1, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1', "links" : 4})
   // await new test().runTask('frc6722', '2023gal', {uuid : 2, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1', "links" : 4})
   // await new test().runTask('frc2830', '2023gal', {uuid : 3, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1', "links" : 4})
   // await new test().runTask('frc3229', '2023gal', {uuid : 4, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1', "links" : 3})
   // await new test().runTask('frc8033', '2023gal', {uuid : 5, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1', "links" : 3})
   // await new test().runTask('frc3603', '2023gal', {uuid : 6, scouterName : 'Cassie', startTime : 1000, notes : "no notes",  "events" : [[0, 1, 19], [2, 2, 1], [4, 7, 10], [12, 0, 16]], "challengeResult" : 1, "autoChallengeResult" : 2, "matchKey" : 'qm1', "links" : 3})

  


}
temp()



 