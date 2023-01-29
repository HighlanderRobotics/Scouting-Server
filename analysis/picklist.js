const BaseAnalysis = require('./BaseAnalysis.js')
const averageScoreOverview = require('./general/averageScoreOverview')
const levelCargo = require('./teleop/cargo/levelPicklist')
const defense1 = require('./defense/defenseOverview')
const autoClimb = require('./auto/climb/climberSucsessAutoDifference')
const avgAutoCargo = require('./general/avgAutoCargo')

class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db, team, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, autoCargo, teleOp, defense, climbAuto) {
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

    }
   

    async runAnalysis() {
        let a = this
                let sum = 0
                // var cone = new cargoCountOverview(a.db, a.team, 1, 2)
                // await cone.runAnalysis()
                // sum += cone.finalizeResults().zScore * a.coneOneScore
                // console.log(a.coneScore)
                // var cube = new cargoCountOverview(a.db, a.team, 0, 2)
                // await cube.runAnalysis()
                // sum += cube.finalizeResults().zScore * a.cubeScore
                var avgScore = new averageScoreOverview(a.db, a.team)
                await avgScore.runAnalysis()
                sum += avgScore.zScoreTeleop * a.teleOp

                var coneOne = new levelCargo(a.db, a.team, 1, 1)
                await coneOne.runAnalysis()
                sum += coneOne.zScore * a.coneOneScore

                var coneTwo = new levelCargo(a.db, a.team, 1, 2)
                await coneTwo.runAnalysis()
                sum += coneTwo.zScore * a.coneTwoScore

                var coneThree = new levelCargo(a.db, a.team, 1, 3)
                await coneThree.runAnalysis()
                sum += coneThree.zScore * a.coneThreeScore

                var cubeOne = new levelCargo(a.db, a.team, 0, 1)
                await cubeOne.runAnalysis()
                sum += cubeOne.zScore * a.cubeOneScore

                var cubeTwo = new levelCargo(a.db, a.team, 0, 2)
                await cubeTwo.runAnalysis()
                sum += cubeTwo.zScore * a.cubeTwoScore

                var cubeThree = new levelCargo(a.db, a.team, 0, 3)
                await cubeThree.runAnalysis()
                sum += cubeThree.zScore * a.cubeThreeScore

                var defense = new defense1(a.db, a.team)
                await defense.runAnalysis()
                sum += defense.zScore * a.defense

                var climberAuto = new autoClimb(a.db, a.team)
                await climberAuto.runAnalysis()
                sum += climberAuto.zScore * a.climbAuto

                var autoCargo = new avgAutoCargo(a.db, a.team)
                await autoCargo.runAnalysis()
                sum += autoCargo.zScore * a.autoCargo
               
            a.result = sum        

    }
    finalizeResults() {
        return {
            "result": this.result
        }
    }

}
module.exports = picklist
