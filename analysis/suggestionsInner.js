const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/scoreForPreiction')
const alliance = require('./alliancePage')
const links = require('./general/links.js')
const Manager = require('../manager/Manager.js')
const cargoCountOverview = require('./teleop/cargo/cargoCountOverview.js')
const climberSucsess = require('./teleop/climber/climberSucsess.js')
const cycling = require('./teleop/cargo/cycling.js')
const driverAbilityTeam = require('./general/driverAblilityTeam.js')
const { sec, floor, cube } = require('mathjs')
const levelCargo = require('./teleop/cargo/levelCargo.js')


// const math = require('mathjs')
// const { max } = require('mathjs')
// const e = require('cors')

class suggestionsInner extends BaseAnalysis {
    static name = `suggestionsInner`

    constructor(db, team1, team2, team3, matchType) {
        super(db)

        this.team1 = team1
        this.team2 = team2
        this.team3 = team3

        this.matchType = matchType

        this.alliance = {}

        this.row1 = [1, 2, 3]
        this.row2 = [4, 5, 6]
        this.row3 = [7, 8, 9]
        //TEST FOR RIGHT SIDE
        this.grid1 = [1, 4, 7]
        this.grid2 = [3, 6, 9]
        //only for triple O
        this.grid3 = [2, 5, 8]
        this.betterGrid = [8]
        this.worseGrid = [5]

        this.edgeTwoOffesneOne = [1, 2]
        this.edgeTwoOffesneTwo = [3]

        this.edgeThreeOffenseOne = [1]
        this.edgeThreeOffenseTwo = [2]
        this.edgeThreeOffenseThree = [3]

        this.scoreMap = { 1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 5, 8: 5, 9: 5 }

        this.levelConversion = { 1: this.row1, 2: this.row2, 3: this.row3 }
    }
    async getWinner() {
        let a = this
        return new Promise(async function (resolve, reject) {

            let climbPoints = 10

            //teleop
            var teleop = {}

            var linksOne = new links(Manager.db, a.team1)
            await linksOne.runAnalysis()
            var cargoOneCones = new cargoCountOverview(Manager.db, a.team1, 1, 2)
            await cargoOneCones.runAnalysis()
            var cargoOneCubes = new cargoCountOverview(Manager.db, a.team1, 0, 2)
            await cargoOneCubes.runAnalysis()

            var linksTwo = new links(Manager.db, a.team2)
            await linksTwo.runAnalysis()
            var cargoTwoCones = new cargoCountOverview(Manager.db, a.team2, 1, 2)
            await cargoTwoCones.runAnalysis()
            var cargoTwoCubes = new cargoCountOverview(Manager.db, a.team2, 0, 2)
            await cargoTwoCubes.runAnalysis()

            var linksThree = new links(Manager.db, a.team3)
            await linksThree.runAnalysis()
            var cargoThreeCones = new cargoCountOverview(Manager.db, a.team3, 1, 2)
            await cargoThreeCones.runAnalysis()
            var cargoThreeCubes = new cargoCountOverview(Manager.db, a.team3, 0, 2)
            await cargoThreeCubes.runAnalysis()

            var climbOne = new climberSucsess(Manager.db, a.team1)
            await climbOne.runAnalysis()

            var climbTwo = new climberSucsess(Manager.db, a.team2)
            await climbTwo.runAnalysis()

            var climbThree = new climberSucsess(Manager.db, a.team3)
            await climbThree.runAnalysis()


            var trippleLinks = linksOne.result + linksTwo.result + linksThree.result
            var arrayTeams = [{ "team": a.team1, "links": linksOne.result, "max": cargoOneCones.max, "levelOne": cargoOneCones.one + cargoOneCubes.one, "levelTwo": cargoOneCones.two + cargoOneCubes.two, "levelThree": cargoOneCones.three + cargoOneCubes.three, "climbTele": climbOne.adjustedPoints },
            { "team": a.team2, "links": linksTwo.result, "max": cargoTwoCones.max, "levelOne": cargoTwoCones.one + cargoTwoCubes.one, "levelTwo": cargoTwoCones.two + cargoTwoCubes.two, "levelThree": cargoTwoCones.three + cargoTwoCubes.three, "climbTele": climbTwo.adjustedPoints },
            { "team": a.team3, "links": linksThree.result, "max": cargoThreeCones.max, "levelOne": cargoThreeCones.one + cargoThreeCubes.one, "levelTwo": cargoThreeCones.two + cargoThreeCubes.two, "levelThree": cargoThreeCones.three + cargoThreeCubes.three, "climbTele": climbThree.adjustedPoints }]
            arrayTeams = arrayTeams.sort(function (a, b) {
                return b.links - a.links;
            });
            let first = arrayTeams[0]
            let second = arrayTeams[1]
            let third = arrayTeams[2]
            let one = { "team": first.team }
            let two = { "team": second.team }
            let three = { "team": third.team }

            let levelArr = []
            for (let i = 0; i < 3; i++) {
                let scoringInfo = { "team": arrayTeams[i].team, "bestLevel": 0, "amount": 0 }
                for (let j = 1; j < 4; j++) {
                    let coneLevel = new levelCargo(Manager.db, arrayTeams[i].team, 1, j)
                    await coneLevel.runAnalysis()
                    let cubeLevel = new levelCargo(Manager.db, arrayTeams[i].team, 0, j)
                    await cubeLevel.runAnalysis()
                    if (a.matchType != "qm") {
                        let num = (coneLevel.result + cubeLevel.result) * a.scoreMap[j * 3] + floor((coneLevel.result + cubeLevel.result) / 3) * 5
                        if (num >= scoringInfo.amount) {
                            scoringInfo.bestLevel = j
                            scoringInfo.amount = coneLevel.result + cubeLevel.result
                        }
                    }
                    if (coneLevel.result  + cubeLevel.result>= scoringInfo.amount) {
                        scoringInfo.bestLevel = j
                        scoringInfo.amount = coneLevel.result + cubeLevel.result
                    }
                }
                levelArr.push(scoringInfo)
            }

            if (trippleLinks >= 4 && trippleLinks < 2) {
                //triple offense zone

                one.role = 0
                two.role = 0
                three.role = 0

                if (levelArr[0].bestLevel == 1 && levelArr[1].bestLevel === 1 && levelArr[2].bestLevel === 1) {
                    one.scoringGrid = a.edgeThreeOffenseOne
                    two.scoringGrid = a.edgeThreeOffenseTwo
                    three.scoringGrid = a.edgeThreeOffenseThree
                }
                else if (levelArr[0].bestLevel === levelArr[1].bestLevel || levelArr[0].bestLevel === levelArr[2].bestLevel || levelArr[1].bestLevel === levelArr[2].bestLevel) {
                    //grid with level below FIX
                    one.scoringGrid = a.grid1
                    two.scoringGrid = a.grid2
                    three.scoringGrid = a.grid3
                }
                else {
                    one.scoringGrid = a.levelConversion(bestRowOne)
                    two.scoringGrid = a.levelConversion(bestRowTwo)
                    three.scoringGrid = a.levelConversion(bestRowThree)
                }

            }
            else {
                //2 offense, 1 defense
                one.role = 0
                two.role = 0
                three.role = 1


                if (levelArr[0].bestLevel == 1 && levelArr[1].bestLevel === 1) {
                    one.scoringGrid = a.edgeTwoOffesneOne
                    two.scoringGrid = a.edgeTwoOffesneTwo
                }
                else if (levelArr[0].bestLevel === levelArr[1].bestLevel) {
                    one.scoringGrid = a.grid1.concat(a.betterGrid)
                    two.scoringGrid = a.grid2.concat(a.worseGrid)
                }
                else {
                    one.scoringGrid = a.levelConversion[levelArr[0].bestLevel]
                    two.scoringGrid = a.levelConversion[levelArr[1].bestLevel]
                }

            }

            let tele = [one, two, three]


            //end game


            let endGame = {}
            // endGame.first = arrayTeams[2].team

            let arrayClimb = arrayTeams.sort(function (a, b) {
                return b.climbTele - a.climbTele;
            });
            let topCylcle = new cycling(Manager.db, arrayClimb[0].team, 1, 2)
            await topCylcle.runAnalysis()


            let topDriverAbility = new driverAbilityTeam(Manager.db, arrayClimb[0].team)
            await topDriverAbility.runAnalysis()
            let thirdTime = 30 - (5 * topDriverAbility.result)
            if (arrayClimb[0].climbTele + arrayClimb[1].climbTele + climbPoints >= 23 && a.matchType == "qm" || a.matchType != "qm" && a.getFinalLevel(arrayClimb[0].team, tele) * (topCylcle.result / (thirdTime + 5)) >= arrayClimb[0].climbTele) {
                //climbNumber = how many should climb
                //2 climb
                let firstClimb = new driverAbilityTeam(Manager.db, arrayClimb[2].team)
                await firstClimb.runAnalysis()
                let secondClimb = new driverAbilityTeam(Manager.db, arrayClimb[1].team)
                await secondClimb.runAnalysis()


                let firstTime = 40 - (5 * firstClimb.result)
                let secondTime = 35 - (5 * secondClimb.result)

                endGame = [{ "team": arrayClimb[2].team, "time": firstTime }, { "team": arrayClimb[1].team, "time": secondTime }]
            }
            else {
                let firstClimb = new driverAbilityTeam(Manager.db, arrayTeams[2].team)
                await firstClimb.runAnalysis()
                let secondClimb = new driverAbilityTeam(Manager.db, arrayTeams[1].team)
                await secondClimb.runAnalysis()


                let firstTime = 40 - (5 * firstClimb.result)
                let secondTime = 35 - (5 * secondClimb.result)

                endGame = [{ "team": arrayTeams[2].team, "time": firstTime }, { "team": arrayTeams[1].team, "time": secondTime }, { "team": arrayTeams[0].team, "time": thirdTime }]
            }

            let finalMap = {"teleop" : tele, "endgame" : endGame}
            console.log(finalMap)


        })


    }
    getFinalLevel(team, teleop) {
        let a = this
        for (let i = 0; i < teleop.length; i++) {
            if (teleop[i].team === team) {
                return a.scoreMap[teleop[i].scoringGrid[teleop[i].scoringGrid.length -1]]
            }
        }
        return 0
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
            "alliance": this.alliance
        }
    }
}

module.exports = suggestionsInner