const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('../manager/dbmanager.js')

const cargoCount = require('./teleop/cargo/cargoCount.js')
const averageScore = require('./general/averageScoreOverview')
const cargoCountAuto = require('./auto/cargo/cargoCountAuto.js')
const cycling = require('./teleop/cargo/cycling.js')
const defense = require('./defense/defenseEvent.js')



// const { i } = require('mathjs')


//2022cc_qm3_2	


class categoryMetrics extends BaseAnalysis {
    static name = `categoryMetrics`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.notes = []
        // this.scoresOverTime = []
        // this.defenseQuantity = 0
        // this.defenseQuality = 0
        // this.ballCount = 0
        // this.autoCount = 0
        this.defenseQuality
    }
    async getData() {
        let a = this

        return new Promise(async (resolve, reject) => {

            //why does await not work when it works in  bestAverageForMetric
            let metrics = {}
            // console.log(result)

            // var defenseFreq = new defenseAmmount(a.db, a.team)
            //     await defenseFreq.runAnalysis()
            //     metrics.defenseQuantity = defenseFreq.finalizeResults().result

            // var defenseQaul = new defenseQuality(a.db, a.team)
            //     await defenseQaul.runAnalysis()
            //     metrics.defenseQuality = defenseQaul.finalizeResults().result




            var scores = new averageScore(a.db, a.team)
            await scores.runAnalysis()
            metrics.avgScore = scores.finalizeResults().score

            var cones = new cargoCount(a.db, a.team, 1, 2)
            await cones.runAnalysis()
            metrics.coneCount = cones.finalizeResults().result
            metrics.coneMax = cones.finalizeResults().max

            var cubes = new cargoCount(a.db, a.team, 0, 2)
            await cubes.runAnalysis()
            metrics.cubeCount = cubes.finalizeResults().result
            metrics.cubeMax = cubes.finalizeResults().max
           
            var cubeAuto = new cargoCountAuto(a.db, a.team, 0)
            await cubeAuto.runAnalysis()
            metrics.cubeCountAuto = cubeAuto.finalizeResults().result

            var coneAuto = new cargoCountAuto(a.db, a.team, 1)
            await coneAuto.runAnalysis()
            metrics.coneCountAuto = coneAuto.finalizeResults().result
        
            var cycleCubeTeam = new cycling(a.db, a.team, 1, 4)
            await cycleCubeTeam.runAnalysis()

            var cycleConeTeam = new cycling(a.db, a.team, 2, 4)
            await cycleConeTeam.runAnalysis()
            metrics.cycleTeam = (cycleConeTeam.result + cycleCubeTeam.result)/2

            var cycleConeScore = new cycling(a.db, a.team, 1, 2)
            await cycleConeScore.runAnalysis()

            var cycleCubeScore = new cycling(a.db, a.team, 0, 2)
            await cycleCubeScore.runAnalysis()
            metrics.cycleCubeScore = cycleCubeScore.result

            var pinCount = new defense(a.db, a.team, 5)
            await pinCount.runAnalysis()
            metrics.pinCount = pinCount.result

            var blockCount = new defense(a.db, a.team, 6)
            await blockCount.runAnalysis()
            metrics.blockCount = blockCount.result

            var cyclingCountCube = new cargoCount(a.db, a.team, 0, 4)
            await cyclingCountCube.runAnalysis()
            var cyclingCountCone = new cargoCount(a.db, a.team, 1, 4)
            await cyclingCountCone.runAnalysis()
            metrics.cyclingCount =(cyclingCountCone.result + cyclingCountCube.result)/2
            
          
// notes: notesOutput 
            resolve({metrics})
        })
    }

    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            a.getData()
                .then((data) => {
                    a.result = data;
                    resolve("done");
                })
                .catch((err) => {
                    if (err) {
                        reject(err);
                        return err;
                    }
                });
        
        })


    }
    finalizeResults() {
        return {
            "result": this.result,
            "team": this.team
        }
    }

}
module.exports = categoryMetrics