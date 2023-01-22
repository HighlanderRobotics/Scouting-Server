const BaseAnalysis = require('./BaseAnalysis.js')
const cargoCountOverview = require('./teleop/cargo/cargoCountOverview')
const averageScoreOverview = require('./general/averageScoreOverview')
const levelCargo = require('./teleop/cargo/levelPicklist')



class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db, team, coneOneScore, coneTwoScore, coneThreeScore, cubeOneScore, cubeTwoScore, cubeThreeScore, auto, teleOp) {
        super(db)
        this.team = team
        this.cubeOneScore = cubeOneScore
        this.cubeTwoScore = cubeTwoScore
        this.cubeThreeScore = cubeThreeScore
        this.auto = auto
        this.teleOp = teleOp
        this.result = 0
        this.coneOneScore = coneOneScore
        this.coneTwoScore = coneTwoScore
        this.coneThreeScore = coneThreeScore

    }
   

    async runAnalysis() {
        let a = this
        
                let sum = 0
                var cone = new cargoCountOverview(a.db, a.team, 1, 2)
                await cone.runAnalysis()
                sum += cone.finalizeResults().zScore * a.coneScore
                var cube = new cargoCountOverview(a.db, a.team, 0, 2)
                await cube.runAnalysis()
                sum += cube.finalizeResults().zScore * a.cubeScore
                var avgScore = new averageScoreOverview(a.db, a.team)
                await avgScore.runAnalysis()
                sum += avgScore.zScoreAuto * a.auto
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
            
            a.result = sum
            console.log("result " + a.result)
        

    }
    finalizeResults() {
        return {
            "result": this.result
        }
    }

}
module.exports = picklist
