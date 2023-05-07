const BaseAnalysis = require('./BaseAnalysis.js')
const scores = require('./general/totalScoreTeamPicklist')
const alliance = require('./alliancePage')
const links = require('./general/links.js')
const Manager = require('../manager/Manager.js')
const cargoCountOverview = require('./teleop/cargo/cargoCountOverview.js')
const climberSucsess = require('./teleop/climber/climberSucsess.js')
const cycling = require('./teleop/cargo/cycling.js')
const driverAbilityTeam = require('./general/driverAblilityTeam.js')
const { sec, floor, cube } = require('mathjs')
const levelCargo = require('./teleop/cargo/levelCargo.js')
const bestPaths = require('./auto/bestAutoPaths.js')
const { on } = require('nodemon')
const e = require('express')
const averageScore = require('./general/averageScore.js')

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
        this.worseGrid = [2]

        this.edgeTwoOffesneOne = [1, 2]
        this.edgeTwoOffesneTwo = [3]

        this.edgeThreeOffenseOne = [1]
        this.edgeThreeOffenseTwo = [2]
        this.edgeThreeOffenseThree = [3]

        this.scoreMap = { 1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 5, 8: 5, 9: 5 }

        this.middleMap = {1 : 2 , 2 : 5, 3: 8}

        this.levelConversion = { 1: this.row1, 2: this.row2, 3: this.row3 }
    }
    async getWinner() {
        let a = this
        return new Promise(async function (resolve, reject) {

            let climbPoints = 0
            let total = 0
            let paths = []
            for (let locFirst = 0; locFirst < 3; locFirst++) {
                var firstAutoOuter = new bestPaths(Manager.db, a.team1)
                await firstAutoOuter.runAnalysis()
                for (let i = 0; i < firstAutoOuter.bestPaths[locFirst].length; i++) {
                    let firstAuto = firstAutoOuter.bestPaths[locFirst][i]
                    for (let locSecond = 0; locSecond < 3; locSecond++) {
                        var secondAutoOuter = new bestPaths(Manager.db, a.team2)
                        await secondAutoOuter.runAnalysis()
                        for (let j = 0; j < secondAutoOuter.bestPaths[locSecond].length; j++) {
                            let secondAuto = secondAutoOuter.bestPaths[locSecond][j]
                            for (let locThird = 0; locThird < 3; locThird++) {
                                var thirdAutoOuter = new bestPaths(Manager.db, a.team3)
                                await thirdAutoOuter.runAnalysis()
                                for (let k = 0; k < thirdAutoOuter.bestPaths[locThird].length; k++) {
                                    let thirdAuto = thirdAutoOuter.bestPaths[locThird][k]
                                    let currTotal = firstAuto.points + secondAuto.points + thirdAuto.points
                                    if (firstAuto.climb === false && secondAuto.climb === false || thirdAuto.climb === false && secondAuto.climb === false || firstAuto.climb === false && thirdAuto.climbPoints === false) {
                                        if (currTotal > total && locFirst != locSecond && locThird != locSecond && locFirst != locThird) {
                                            if (firstAuto.climbPoints + secondAuto.climbPoints + thirdAuto.climbPoints >= climbPoints && a.matchType == "qm") {
                                                climbPoints = firstAuto.climbPoints + secondAuto.climbPoints + thirdAuto.climbPoints
                                                total = currTotal
                                                paths = [{ "team": a.team1, "path": firstAuto.path, "climbPoints": firstAuto.climbPoints }, { "team": a.team2, "path": secondAuto.path, "climbPoints": secondAuto.climbPoints }, { "team": a.team3, "path": thirdAuto.path, "climbPoints": thirdAuto.climbPoints }]
                                            }
                                            else {
                                                climbPoints = firstAuto.climbPoints + secondAuto.climbPoints + thirdAuto.climbPoints
                                                total = currTotal
                                                paths = [{ "team": a.team1, "path": firstAuto.path, "climbPoints": firstAuto.climbPoints }, { "team": a.team2, "path": secondAuto.path, "climbPoints": secondAuto.climbPoints }, { "team": a.team3, "path": thirdAuto.path, "climbPoints": thirdAuto.climbPoints }]
                                            }
                                        }
                                    }
                                }


                            }
                        }
                    }
                }

            }

            //teleop
            //done
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

            var onePoints = new averageScore(Manager.db, a.team1, 1)
            await onePoints.runAnalysis()

            var twoPoints = new averageScore(Manager.db, a.team1, 1)
            await twoPoints.runAnalysis()

            var threePoints = new averageScore(Manager.db, a.team1, 1)
            await threePoints.runAnalysis()


            var trippleLinks = linksOne.average + linksTwo.average + linksThree.average
            var arrayTeams = [{ "team": a.team1, "links": linksOne.average, "max": Math.max(cargoOneCones.max, cargoOneCubes.max), "levelOne": cargoOneCones.one + cargoOneCubes.one, "levelTwo": cargoOneCones.two + cargoOneCubes.two, "levelThree": cargoOneCones.three + cargoOneCubes.three, "climbTele": climbOne.averagePoints, "avgTelePoints" : onePoints.average },
            { "team": a.team2, "links": linksTwo.average, "max": Math.max(cargoTwoCones.max, cargoTwoCubes.max), "levelOne": cargoTwoCones.one + cargoTwoCubes.one, "levelTwo": cargoTwoCones.two + cargoTwoCubes.two, "levelThree": cargoTwoCones.three + cargoTwoCubes.three, "climbTele": climbTwo.averagePoints, "avgTelePoints" : twoPoints.average  },
            { "team": a.team3, "links": linksThree.average, "max": Math.max(cargoThreeCones.max, cargoThreeCubes.max), "levelOne": cargoThreeCones.one + cargoThreeCubes.one, "levelTwo": cargoThreeCones.two + cargoThreeCubes.two, "levelThree": cargoThreeCones.three + cargoThreeCubes.three, "climbTele": climbThree.averagePoints, "avgTelePoints" : threePoints.average  }]
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
                        let num = (coneLevel.average + cubeLevel.average) * a.scoreMap[j * 3] + floor((coneLevel.average + cubeLevel.average) / 3) * 5
                        if (num >= scoringInfo.amount) {
                            scoringInfo.bestLevel = j
                            scoringInfo.amount = coneLevel.average + cubeLevel.average
                        }
                    }
                    else if (coneLevel.average + cubeLevel.average >= scoringInfo.amount) {
                        scoringInfo.bestLevel = j
                        scoringInfo.amount = coneLevel.average + cubeLevel.average
                    }
                }
                scoringInfo.max = arrayTeams[i].max
                levelArr.push(scoringInfo)
            }

            if (trippleLinks <= 6 && trippleLinks > 3) {
                //triple offense zone

                one.role = 0
                two.role = 0
                three.role = 0
                if (arrayTeams[0].max == 1 && arrayTeams[1].max === 1 && arrayTeams[2].max === 1) {
                    one.scoringGrid = a.edgeThreeOffenseOne
                    two.scoringGrid = a.edgeThreeOffenseTwo
                    three.scoringGrid = a.edgeThreeOffenseThree
                }
                else if (arrayTeams[0].bestLevel === arrayTeams[1].bestLevel || arrayTeams[0].bestLevel === arrayTeams[2].bestLevel || arrayTeams[1].bestLevel === arrayTeams[2].bestLevel) {
                    
                    if (arrayTeams[0].max === 1 || arrayTeams[1].max === 1 || arrayTeams[2].max === 1) {
                        if (levelArr[0].max === 1) {
                            
                            one.scoringGrid = a.levelConversion[1]
                            two.scoringGrid = a.grid1.slice(0, arrayTeams[1].max -1).concat(a.middleMap(levelArr[1].max))
                            three.scoringGrid = a.grid2.slice(0, arrayTeams[2].max -1).concat([5])
                        }
                        else if (levelArr[1].max === 1) {
                            two.scoringGrid = a.levelConversion[1]
                            one.scoringGrid = a.grid1.slice(0, arrayTeams[0].max).concat(a.middleMap(levelArr[0].max))
                            three.scoringGrid = a.grid2.slice(0, arrayTeams[2].max).concat([5])
                        }
                        else{
                            console.log("here")
                            three.scoringGrid = a.levelConversion[1]
                            two.scoringGrid = a.grid1.slice(0, arrayTeams[1].max).concat([5])
                            one.scoringGrid = a.grid2.slice(0, arrayTeams[0].max).concat(a.middleMap[arrayTeams[1].max])
                        }

                    }
                    else {
                        one.scoringGrid = a.grid1
                        two.scoringGrid = a.grid2
                        three.scoringGrid = a.grid3
                    }

                }
                else {
                    one.scoringGrid = a.levelConversion[arrayTeams[0].bestLevel]
                    two.scoringGrid = a.levelConversion[arrayTeams[1].bestLevel]
                    three.scoringGrid = a.levelConversion[arrayTeams[2].bestLevel]
                }

            }
            else {

                //2 offense, 1 defense
                one.role = 0
                two.role = 0
                three.role = 1


                if (arrayTeams[0].max == 1 && arrayTeams[1].max === 1) {
                    one.scoringGrid = a.edgeTwoOffesneOne
                    two.scoringGrid = a.edgeTwoOffesneTwo
                }
                else if (arrayTeams[0].bestLevel === arrayTeams[1].bestLevel) {
                    one.scoringGrid = a.grid1.slice(0, arrayTeams[0].max).concat(a.middleMap[arrayTeams[0].max])
                    two.scoringGrid = a.grid2.slice(0, arrayTeams[1].max).concat([2])
                }
                else {
                    one.scoringGrid = a.levelConversion[arrayTeams[0].bestLevel]
                    two.scoringGrid = a.levelConversion[arrayTeams[1].bestLevel]
                }

            }

            let tele = [one, two, three]

            //end game


            let endGame = {}

            let arrayClimb = arrayTeams
            let topCylcle = new cycling(Manager.db, arrayClimb[0].team, 1, 2)
            await topCylcle.runAnalysis()

            
            let topDriverAbility = new driverAbilityTeam(Manager.db, arrayClimb[0].team)
            await topDriverAbility.runAnalysis()
            let thirdTime = 30 - (5 * topDriverAbility.average)
            if (arrayClimb[0].climbTele + arrayClimb[1].climbTele + climbPoints >= 23 && a.matchType == "qm" || a.matchType != "qm" && a.getFinalLevel(arrayClimb[0].team, tele) * (topCylcle.result / (thirdTime + 5)) >= arrayClimb[0].climbTele) {
                //climbNumber = how many should climb
                //2 climb
                let firstClimb = new driverAbilityTeam(Manager.db, arrayClimb[2].team)
                await firstClimb.runAnalysis()
                let secondClimb = new driverAbilityTeam(Manager.db, arrayClimb[1].team)
                await secondClimb.runAnalysis()


                let firstTime = 40 - (5 * firstClimb.average)
                let secondTime = 35 - (5 * secondClimb.average)

                endGame = [{ "team": arrayClimb[2].team, "time": firstTime }, { "team": arrayClimb[1].team, "time": secondTime }]
            }
            else {
                let firstClimb = new driverAbilityTeam(Manager.db, arrayTeams[2].team)
                await firstClimb.runAnalysis()
                let secondClimb = new driverAbilityTeam(Manager.db, arrayTeams[1].team)
                await secondClimb.runAnalysis()


                let firstTime = 40 - (5 * firstClimb.average)
                let secondTime = 35 - (5 * secondClimb.average)

                endGame = [{ "team": arrayTeams[2].team, "time": firstTime }, { "team": arrayTeams[1].team, "time": secondTime }, { "team": arrayTeams[0].team, "time": thirdTime }]
            }

            a.alliance = { "teleop": tele, "endgame": endGame, "auto": paths }
            resolve("done")

        })


    }
    // checkPickUpMiddle(arrayOne, arrayTwo, arrayThree)
    // {
    //     if(arrayOne.)
    //     for(let i = 0; i < arrayOne.scoringRow.length; i ++)
    //     {
    //         for(let j = 0; j < arrayTwo.scoringRow.length; j ++)
    //         {
    //             for(let k = 0; k < arrayThree.scoringRow.length; k ++)
    //             {
    //                 if(arrayOne.all.scoringRow[i] === arrayTwo.scoringRow[j] || arrayThree.scoringRow[k] === arrayOne.scoringRow[i] || arrayTwo.scoringRow[j] === arrayThree.scoringRow[k])
    //                 {
    //                     return false
    //                 }
    //             }
    //             if(arrayOne.all.scoringRow[i] === arrayTwo.all.scoringRow[j])
    //             {
    //                 return false
    //             }
    //         }
    //     }
    //     return true
    // }
    getFinalLevel(team, teleop) {
        let a = this
        for (let i = 0; i < teleop.length; i++) {
            if (teleop[i].team === team) {
                if (teleop[i].scoringGrid === undefined) {
                    return 0
                }
                else {
                    return a.scoreMap[teleop[i].scoringGrid[teleop[i].scoringGrid.length - 1]]
                }
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