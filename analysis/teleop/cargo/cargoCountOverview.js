const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cargoCount.js')
const all = require('./cargoCountAll.js')
const difference = require('./cargoCountDifference.js')
const levelCargo = require('./levelCargo')
const math = require('mathjs')


// const Manager = require('./manager/dbmanager.js')

class cargoCountOverview extends BaseAnalysis {
    static name = `cargoCountOverview`

    constructor(db, team, type, location) {
        super(db)
        this.team = team
        this.type = type
        this.location = location
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = 0
        this.all = 0
        this.difference = 0
        this.type = type
        this.zScore = 0
        this.one = 0
        this.two = 0
        this.three = 0
        this.max = 0
        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, a.type, a.location)
        await x.runAnalysis()
        let y = new all(a.db, a.type, a.location)
        await y.runAnalysis()
        let z = new difference(a.db, a.team, a.type, a.location)
        await z.runAnalysis()
        let levelOne = new levelCargo(a.db, a.team, a.type, 1)
        await levelOne.runAnalysis()
        let levelTwo = new levelCargo(a.db, a.team, a.type, 2)
        await levelTwo.runAnalysis()
        let levelThree = new levelCargo(a.db, a.team, a.type, 3)
        await levelThree.runAnalysis()
        a.result = x.result
        a.array = x.array
        a.matches = x.matches
        a.max = x.max
        a.all = y.result
        a.difference = z.result
        a.one = levelOne.result
        a.two = levelTwo.result
        a.three = levelThree.result
        let temp = math.std(y.array)
        a.zScore = a.difference/temp


    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.result,
            "array" : this.array,
            "difference" : this.difference,
            "zScore" : this.zScore,
            "all" : this.all,
            "one" : this.one,
            "two" : this.two,
            "three" : this.three,
            "team": this.team,
            "max" : this.max
        }
    }

}
module.exports = cargoCountOverview
