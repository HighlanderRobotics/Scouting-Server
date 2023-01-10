const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/averageScore.js')

const math = require('jstat')

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
        // this.notes = []
        // this.scoresOverTime = []
        // this.defenseQuantity = 0
        // this.defenseQuality = 0
        // this.ballCount = 0
        // this.autoCount = 0
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
            let red1SDV = math.stdev(redArr1)
            var score2 = new scores(a.db, a.red2)
            await score2.runAnalysis()
            let redArr2 = score2.finalizeResults().array
            let red2SDV = math.stdev(redArr2)
            var score3 = new scores(a.db, a.red3)
            await score3.runAnalysis()
            let redArr3 = score3.finalizeResults().array
            let red3SDV = math.stdev(redArr3)


            if (red1SDV === 0 || red2SDV === 0 || red3SDV) {
                a.result = null
                resolve("not enough data")
            }

            let redAllianceSDV = Math.sqrt(Math.pow(red1SDV, 2) + Math.pow(red2SDV, 2) + Math.pow(red3SDV, 2))
            let redAllianceMean = await a.getMean(redArr1) + await a.getMean(redArr2) + await a.getMean(redArr3)

            var score4 = new scores(a.db, a.blue1)
            await score4.runAnalysis()
            let blueArr1 = score4.finalizeResults().array
            let blue1SDV = math.stdev(blueArr1)
            var score5 = new scores(a.db, a.blue2)
            await score5.runAnalysis()
            let blueArr2 = score5.finalizeResults().array
            let blue2SDV = math.stdev(blueArr2)
            var score6 = new scores(a.db, a.blue3)
            await score6.runAnalysis()
            let blueArr3 = score6.finalizeResults().array
            let blue3SDV = math.stdev(blueArr3)

            if (blue1SDV === 0 || blue2SDV === 0 || blue3SDV) {
                a.result = null

                resolve("not enough data")
            }

            let blueAllianceSDV = Math.sqrt(Math.pow(blue1SDV, 2) + Math.pow(blue2SDV, 2) + Math.pow(blue3SDV, 2))
            let blueAllianceMean = await a.getMean(blueArr1) + await a.getMean(blueArr2) + await a.getMean(blueArr3)
            console.log(blue1SDV)

            let differentialSDV = Math.sqrt(Math.pow(redAllianceSDV, 2) + Math.pow(blueAllianceSDV, 2))
            let differentialMean = redAllianceMean - blueAllianceMean

            let redLoosing = await a.GetZPercent((0 - differentialMean) / differentialSDV)

            a.result = 1 - redLoosing
            // console.log("result " + a.result)
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
    async getMean(teamArray) {
        var total = 0;
        for (var i = 0; i < teamArray.length; i++) {
            total += teamArray[i];
        }
        return total / teamArray.length;
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
            "result": this.result
        }
    }
}
module.exports = predictWinning