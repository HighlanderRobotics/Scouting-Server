//for testing

const Manager = require('./manager/dbmanager')
const y = require("./test")

const test = require('./analysis/cargoAccuracy')
var x = new test(Manager.db, 8033)
x.runAnalysis()
let done = x.finalizeResults()
setTimeout(function() {
    console.log(done);
  }, 2000);
  
