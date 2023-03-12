const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/scoreForPreiction')

const math = require('mathjs')

class predictWinning extends BaseAnalysis {
    static name = `predictWinning`

    constructor(db, red1, red2, red3, blue1, blue2, blue3,) {
        super(db)

        this.red1 = red1
        this.red2 = red2
        this.red3 = red3
        this.blue1 = blue1
        this.blue2 = blue2
        this.blue3 = blue3
    
        this.result = 0
    }
    async getWinner() {
        let a = this
        return new Promise(async function (resolve, reject) {
            // if(err)
            // {
            //     reject(err);
            // }


            var score1 = new scores(a.db, a.red1)
            await score1.runAnalysis()
            let redArr1 = score1.finalizeResults().array

            var score2 = new scores(a.db, a.red2)
            await score2.runAnalysis()
            let redArr2 = score2.finalizeResults().array
            

            var score3 = new scores(a.db, a.red3)
            await score3.runAnalysis()
            let redArr3 = score3.finalizeResults().array



            if (redArr1.length <=1 || redArr2.length <= 1 || redArr3.length <= 1) {
                a.result = null
                resolve("not enough data")
                return
            }
            let red1SDV = math.std(redArr1)
            let red2SDV = math.std(redArr2)
            let red3SDV = math.std(redArr3)

            let redAllianceSDV = Math.sqrt(Math.pow(red1SDV, 2) + Math.pow(red2SDV, 2) + Math.pow(red3SDV, 2))
            let redAllianceMean = await a.getMean(redArr1) + await a.getMean(redArr2) + await a.getMean(redArr3)

            var score4 = new scores(a.db, a.blue1)
            await score4.runAnalysis()
            let blueArr1 = score4.finalizeResults().array

            var score5 = new scores(a.db, a.blue2)
            await score5.runAnalysis()
            let blueArr2 = score5.finalizeResults().array

            var score6 = new scores(a.db, a.blue3)
            await score6.runAnalysis()
            let blueArr3 = score6.finalizeResults().array

            if (blueArr1.length <= 1 || blueArr2.length <= 1|| blueArr3.length <= 1) {
                a.result = null
                resolve("not enough data")
                return
            }
            let blue1SDV = math.std(blueArr1)
            let blue2SDV = math.std(blueArr2)
            let blue3SDV = math.std(blueArr3)



            let blueAllianceSDV = Math.sqrt(Math.pow(blue1SDV, 2) + Math.pow(blue2SDV, 2) + Math.pow(blue3SDV, 2))
            let blueAllianceMean = await a.getMean(blueArr1) + await a.getMean(blueArr2) + await a.getMean(blueArr3)

            let differentialSDV = Math.sqrt(Math.pow(redAllianceSDV, 2) + Math.pow(blueAllianceSDV, 2))
            let differentialMean = redAllianceMean - blueAllianceMean

            let redLoosing = await a.GetZPercent((0 - differentialMean) / differentialSDV)

            a.redWinning = 1 - redLoosing
            a.blueWiinning = 1 -a.redWinning
            resolve(1 - redLoosing)


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
            "blueWinning": this.blueWiinning
        }
    }
}
    
module.exports = predictWinning