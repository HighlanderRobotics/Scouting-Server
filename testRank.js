const test = require('./manager/getRankOfTeam')
async function temp() {
  
  
  let t = await new test().runTask("frc8033", "2023camb")
  console.log(t)
 
    
}
temp()


//2022cc_qm9_5	3256
//2022cc_qm31_5 3476

 