//for testing

const Manager = require('./manager/dbmanager')
const test = require('./analysis/teleop/cargo/levelCargo')
// const test = require('./analysis/auto/cargo/cargoAutoOverview')

// const y = require("./test")
async function temp() {
  //  var x = new test(Manager.db, "2022cc", 0, 0, 0, 0, 1, 0, 0, 0, 0, 0)
   var x = new test(Manager.db, 254, 1)
  await x.runAnalysis()
 console.log(x.finalizeResults())
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476
//2022cc_qm34_5 2813
