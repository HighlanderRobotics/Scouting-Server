//for testing

const Manager = require('./manager/dbmanager')

const test = require('./analysis/climberMax')
var x = new test(Manager.db, 4499)
x.runAnalysis()
let done = x.finalizeResults()
setTimeout(function() {
    console.log(done);
  }, 2000);
  
