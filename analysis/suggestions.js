const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/scoreForPreiction')
const alliance = require('./alliancePage')
const Manager = require('../manager/dbmanager.js')
const suggestionsInner = require('./suggestionsInner.js')

// const math = require('mathjs')
// const { max } = require('mathjs')
// const e = require('cors')

class suggestions extends BaseAnalysis {
    static name = `suggestions`

    constructor(db, red1, red2, red3, blue1, blue2, blue3, matchType) {
        super(db)

        this.red1 = red1
        this.red2 = red2
        this.red3 = red3
        this.blue1 = blue1
        this.blue2 = blue2
        this.blue3 = blue3
        this.matchType = matchType
        //red = 0
        //blue = 1
        this.blueAlliance = {}
        this.redAlliance = {}
    }
    async getWinner() {
        let a = this
       
            // var blue = new suggestionsInner(Manager.db, a.blue1, a.blue2, a.blue3, a.matchType)
            // await blue.runAnalysis()
            // var red = new suggestionsInner(Manager.db, a.red1, a.red2, a.red3, a.matchType)
            // await red.runAnalysis()
            
            // a.blueAlliance = blue.alliance
            // a.redAlliance = red.alliance
            
            resolve("done")


    


    }
    

   
    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.getWinner().catch((err) => {

            })
            // a.result = temp   
            resolve("done")
        })


    }
    
    finalizeResults() {
        return {
            "red1": this.red1,
            "red2": this.red2,
            "red3": this.red3,
            "blue1": this.blue1,
            "blue2": this.blue2,
            "blue3": this.blue3,
            "redAlliance" : this.redAlliance,
            "blueAlliance" : this.blueAlliance

        }
    }
}
    
module.exports = suggestions