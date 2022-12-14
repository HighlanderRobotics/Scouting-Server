//for testing

const Manager = require('./manager/dbmanager')

const test = require('./analysis/overview')
var x = new test(Manager.db, 8033, 2022)
x.runAnalysis()
let done = x.finalizeResults()
setTimeout(function() {
    console.log(done);
  }, 2000);
  
