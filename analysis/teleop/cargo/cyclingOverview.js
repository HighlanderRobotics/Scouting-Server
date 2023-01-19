const BaseAnalysis = require('../../BaseAnalysis.js')
const teamStat = require('./cycling.js')
const all = require('./cyclingAll.js')
const difference = require('./cyclingDifference.js')
const cargoTeam = require('./cargoCount.js')
const cargoAll = require('./cargoCountAll.js')
const cargoDifference = require('./cargoCountDifference.js')
const cargoCount = require('./cargoCount.js')
const cargoCountOverview = require('./cargoCountOverview.js')

// const Manager = require('./manager/dbmanager.js')

class cyclingOverview extends BaseAnalysis {
    static name = `cyclingOverview`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
       this.cycleCone = 0
       this.cycleCube = 0
       this.coneCycleArray = []
       this.cubeCycleArray = []
       this.cubeCount = 0
       this.coneCount = 0
       this.cubeCountArray = []
       this.coneCountArray = []


        // this.array = []

    }
    async getAccuracy() {
        let a = this
        let x = new teamStat(a.db, a.team, 0, 4)
        await x.runAnalysis()
        let y = new teamStat(a.db, a.team, 1, 4)
        await y.runAnalysis()
        let cubeCount = new cargoCount(a.db, a.team, 0, 4)
        await cubeCount.runAnalysis()
        let coneCount = new cargoCount(a.db, a.team,1, 4 )
        await coneCount.runAnalysis()


        let cube = new cargoCount(a.db, 1, )

        a.cycleCone = x.result
        a.cycleCube = y.result
        a.coneCycleArray = x.finalizeResults().array
        a.cubeCycleArray = y.finalizeResults().array
        a.cubeCount = cubeCount.result
        a.coneCount = coneCount.result
        a.cubeCountArray = cubeCount.finalizeResults().array
        a.coneCountArray = cubeCount.finalizeResults().array


        


        
        

    }


    runAnalysis() {
        return new Promise(async (resolve, reject) => {
            let a = this
            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            console.log(a.result)
            resolve("done")

        })

    }
    finalizeResults() {
        return {
            "cycleCone" : this.cycleCone,
            "cycleCube" : this.cycleCube ,
            "coneCycleArray" : this.coneCycleArray,
            "cubeCycleArray" : this.cubeCycleArray,
            "cubeCount" : this.cubeCount,
           "coneCount" : this.coneCount ,
           "cubeCountArray" : this.cubeCountArray ,
           "coneCountArray" : this.coneCountArray,
           "team" : this.team 
            
        }
    }

}
module.exports = cyclingOverview
