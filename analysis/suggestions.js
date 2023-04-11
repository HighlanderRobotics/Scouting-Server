const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/scoreForPreiction')
const alliance = require('./alliancePage')

// const math = require('mathjs')
// const { max } = require('mathjs')
// const e = require('cors')

class suggestions extends BaseAnalysis {
    static name = `suggestions`

    constructor(db, red1, red2, red3, blue1, blue2, blue3,) {
        super(db)

        this.red1 = red1
        this.red2 = red2
        this.red3 = red3
        this.blue1 = blue1
        this.blue2 = blue2
        this.blue3 = blue3
        //red = 0
        //blue = 1
        this.blueAlliance = {}
        this.redAlliance = {}
    }
    async getWinner() {
        let a = this
        return new Promise(async function (resolve, reject) {
            // if(err)
            // {
            //     reject(err);
            // }

            
            
            resolve("done")


        })


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
            "redWinning": this.redWinning,
            "blueWinning": this.blueWiinning,
            "winningAlliance" : this.winningAlliance,
            "redAlliance" : this.redAlliance,
            "blueAlliance" : this.blueAlliance

        }
    }
}
    
module.exports = suggestions