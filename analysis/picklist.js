const BaseAnalysis = require('./BaseAnalysis.js')
const averageScoreOverview = require('./general/averageScoreOverview')
const levelCargo = require('./teleop/cargo/levelPicklist')
const cargoOverview = require('./teleop/cargo/cargoCountOverview')
const defense1 = require('./defense/defenseOverview')
const autoClimb = require('./auto/climb/climberSucsessAutoDifference')
const avgAutoCargo = require('./general/avgAutoCargo')
const teamAvgTotal = require('./general/totalScoreDifference')
const climberSucsessDifference = require('./teleop/climber/climberSucsessDifference.js')
const driverAbility = require('./general/driverAbilityOverview')

class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db, team, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, autoCargo, teleOp, defense, climbAuto, feedCone, feedCube, avgTotal, teleopClimb, driverAbility) {
        super(db)
        this.team = team
        this.cubeOneScore = cubeOneScore
        this.cubeTwoScore = cubeTwoScore
        this.cubeThreeScore = cubeThreeScore
        this.autoCargo = autoCargo
        this.teleOp = teleOp
        this.result = 0
        this.coneOneScore = coneOneScore
        this.coneTwoScore = coneTwoScore
        this.coneThreeScore = coneThreeScore
        this.defense = defense
        this.climbAuto = climbAuto
        this.array = []
        this.feedingCone = feedCone
        this.feedingCube = feedCube
        this.avgTotal = avgTotal
        this.teleopClimb = teleopClimb
        this.driverAbility = driverAbility

        this.unadjustedZScores = []

    }
   

    async runAnalysis() {
        let a = this
                let arr = []
                let unAdj = []
                // var cone = new cargoCountOverview(a.db, a.team, 1, 2)
                // await cone.runAnalysis()
                // sum += cone.finalizeResults().zScore * a.coneOneScore
                // var cube = new cargoCountOverview(a.db, a.team, 0, 2)
                // await cube.runAnalysis()
                // sum += cube.finalizeResults().zScore * a.cubeScore
                var avgScore = new averageScoreOverview(a.db, a.team)
                await avgScore.runAnalysis()
                arr.push({"result" : avgScore.zScore * a.teleOp, "type" : "teleopScore"})
                arr.push({"result" : avgScore.zScore, "type" : "teleopScore"})

                var coneOne = new levelCargo(a.db, a.team, 1, 1)
                await coneOne.runAnalysis()
                arr.push({"result": coneOne.zScore * a.coneOneScore, "type": "coneOneScore"})
                arr.push({"result" : avgScore.zScore, "type" : "coneOneScore"})


                var coneTwo = new levelCargo(a.db, a.team, 1, 2)
                await coneTwo.runAnalysis()
                arr.push({"result" :coneTwo.zScore * a.coneTwoScore, "type" : "coneTwoScore"})
                arr.push({"result" :coneTwo.zScore, "type" : "coneTwoScore"})


                var coneThree = new levelCargo(a.db, a.team, 1, 3)
                await coneThree.runAnalysis()
                arr.push({"result": coneThree.zScore * a.coneThreeScore, "type": "coneThreeScore"})
                arr.push({"result": coneThree.zScore, "type": "coneThreeScore"})



                var cubeOne = new levelCargo(a.db, a.team, 0, 1)
                await cubeOne.runAnalysis()
                arr.push({"result": cubeOne.zScore * a.cubeOneScore, "type": "cubeOneScore"})
                arr.push({"result": cubeOne.zScore, "type": "cubeOneScore"})


                var cubeTwo = new levelCargo(a.db, a.team, 0, 2)
                await cubeTwo.runAnalysis()
                arr.push({"result": cubeTwo.zScore * a.cubeTwoScore, "type": "cubeTwoScore"})
                arr.push({"result": cubeTwo.zScore, "type": "cubeTwoScore"})



                var cubeThree = new levelCargo(a.db, a.team, 0, 3)
                await cubeThree.runAnalysis()
                arr.push({"result": cubeThree.zScore * a.cubeThreeScore, "type": "cubeThreeScore"})
                arr.push({"result": cubeThree.zScore, "type": "cubeThreeScore"})



                var defense = new defense1(a.db, a.team)
                await defense.runAnalysis()
                arr.push({"result": defense.zScore * a.defense, "type": "defenseScore"})
                arr.push({"result": defense.zScore, "type": "defenseScore"})


                var climberAuto = new autoClimb(a.db, a.team)
                await climberAuto.runAnalysis()
                arr.push({"result": climberAuto.zScore * a.climbAuto, "type": "autoClimb"})
                arr.push({"result": climberAuto.zScore, "type": "autoClimb"})


                var autoCargo1 = new avgAutoCargo(a.db, a.team)
                await autoCargo1.runAnalysis()
                arr.push({"result": autoCargo1.zScore * a.autoCargo, "type": "autoCargo"})
                arr.push({"result": autoCargo1.zScore, "type": "autoCargo"})


                var feedCone = new cargoOverview(a.db, a.team, 1, 4)
                await feedCone.runAnalysis()
                let x = feedCone.zScore * a.feedingCone
                arr.push({"result": x, "type": "feedCone"})
                arr.push({"result": feedCone.zScore, "type": "feedCone"})



                var feedCube = new cargoOverview(a.db, a.team, 0, 4)
                await feedCube.runAnalysis()
                let y = feedCube.zScore * a.feedingCube
                arr.push({"result": feedCube.zScore * a.feedingCube, "type": "feedCube"})
                arr.push({"result": feedCube.zScore, "type": "feedCube"})


                var score = new teamAvgTotal(a.db, a.team)
                await score.runAnalysis()
                arr.push({"result": score.zScore * a.avgTotal, "type": "avgTotal"})
                arr.push({"result": score.zScore, "type": "avgTotal"})


                var teleClimb = new climberSucsessDifference(a.db, a.team)
                await teleClimb.runAnalysis()
                arr.push({"result": teleClimb.zScore * a.teleopClimb, "type": "teleopClimb"})
                arr.push({"result": teleClimb.zScore, "type": "teleopClimb"})


                var driveAbility = new driverAbility(a.db, a.team)
                await driveAbility.runAnalysis()
                arr.push({"result" : driveAbility.zScore * a.driverAbility, "type" : "driverAbility"})
                arr.push({"result" : driveAbility.zScore, "type" : "driverAbility"})

                
                



            a.unadjustedZScores = unAdj
            a.array = arr
            a.result = arr.reduce((partialSum, a) => partialSum + a.result, 0)



    }
    finalizeResults() {
        return {
            "result": this.result,
            "array" : this.array,
            "unadjusted" : this.unadjustedZScores
        }
    }

}
module.exports = picklist
