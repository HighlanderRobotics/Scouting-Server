//for testing
const test = require('./manager/getMutablePicklists')

const Manager = require('./manager/dbmanager')

// const y = require("./test")
async function temp() {
   console.log(await new test().runTask(8033))
   // return new test().runTask(8033)
}
temp()



 