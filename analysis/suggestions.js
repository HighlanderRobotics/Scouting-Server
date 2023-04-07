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
    async GetZPercent(z) {
        return new Promise(function (resolve, reject) {
            // if(err)
            // {
            //     reject(err);
            // }
            if (z < -6.5)
                resolve(0.0);
            if (z > 6.5)
                resolve(1.0);

            var factK = 1;
            var sum = 0;
            var term = 1;
            var k = 0;
            var loopStop = Math.exp(-23);
            while (Math.abs(term) > loopStop) {
                term = .3989422804 * Math.pow(-1, k) * Math.pow(z, k) / (2 * k + 1) / Math.pow(2, k) * Math.pow(z, k + 1) / factK;
                sum += term;
                k++;
                factK *= k;

            }
            sum += 0.5;

            resolve(sum);
        })
        //z == number of standard deviations from the mean

        //if z is greater than 6.5 standard deviations from the mean
        //the number of significant digits will be outside of a reasonable 
        //range

    }
    async getMean(teamArray) {
        return new Promise(function (resolve, reject) {

            var total = 0;
            for (var i = 0; i < teamArray.length; i++) {
                total += teamArray[i];
            }
            resolve(total / teamArray.length);
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