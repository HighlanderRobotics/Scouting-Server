const BaseAnalysis = require('../BaseAnalysis')
const teamStat = require('./averageScore')
const all = require('./averageScoreAll.js')
const difference = require('./averageScoreDifference.js')
const level = require('../teleop/cargo/levelCargo')
const climb = require('../teleop/climber/climberSucsess')
const math = require('mathjs')
const { resolve } = require('mathjs')

//scoring breakdown for pie chart
//if matchnumber is not valid/is null it returns the average split of scoring
//if a match is given it just gives the breakdown of that match
//also gives array of scores over time, overall auto/tele averge, team average and difference
class scoringBreakdown extends BaseAnalysis {
    static name = `scoringBreakdown`

    constructor(db, team, autoOreTele, tournamentKey, matchNumber, matchType) {
        super(db)
        this.teamKey = "frc" + team
        this.arrayOfScores = []
        this.all = 0
        this.autoOrTele = autoOreTele
        this.difference = 0
        this.pieChart = {}
        this.tournamentKey = tournamentKey
        this.matchNumber = matchNumber
        this.matchType = matchType
        this.averageScore = 0

    }
    async getAccuracy() {
        let a = this
        let matchKey = ""
        if (this.matchNumber)
        {
            var sql = `SELECT key
                    FROM matches
                    WHERE tournamentKey = ? and matchNumber = ? and matchType = ? and teamKey = ?`;
            a.db.all(sql, [a.tournamentKey, a.matchNumber, a.matchType, a.teamKey], (err, rows) => {
                if(err)
                {
                    console.log(err)
                }
                if(rows.length > 0)
                {
                    matchKey = rows[0].key
                }

            })
        }
    
            
            let team = new teamStat(a.db, a.team, a.autoOrTele)
            await team.runAnalysis()
            let allAvg = new all(a.db, a.autoOrTele)
            await allAvg.runAnalysis()
            let diff = new difference(a.db, a.team, a.autoOrTele)
            await diff.runAnalysis()

            a.averageScore = team.average
            a.all = allAvg.average
            a.difference = diff.average
            a.arrayOfScores = team.finalizeResults().array



            let oneCone = new level(a.db, a.team, 1, 1)
            await oneCone.runAnalysis()

            let twoCone = new level(a.db, a.team, 1, 2)
            await twoCone.runAnalysis()

            let threeCone = new level(a.db, a.team, 1, 3)
            await threeCone.runAnalysis()

            let oneCube = new level(a.db, a.team, 0, 1)
            await oneCube.runAnalysis()

            let twoCube = new level(a.db, a.team, 0, 2)
            await twoCube.runAnalysis()

            let threeCube = new level(a.db, a.team, 0, 3)
            await threeCube.runAnalysis()

            let climbAvg = new climb(a.db, a.team)
            await climbAvg.runAnalysis()



            if (!this.matchNumber) {
                //if there is no specified match it just uses overall averages
                let pieChart = { "coneOne": (oneCone.average * 2) / a.averageScore, "coneTwo": (twoCone.average * 3) / a.averageScore, "coneThree": (threeCone.average * 5) / a.averageScore, "cubeOne": (oneCube.average * 2) / a.averageScore, "cubeTwo": (twoCube.average * 3) / a.averageScore, "cubeThree": (threeCube.average * 5) / a.averageScore, "climb": ((climbAvg.level * 10 + climbAvg.tipped * 6) / climbAvg.totalAttempted) / a.averageScore }
                a.pieChart = pieChart
            }
            else {
                //if a match is given it breakdown that match using the arrays
                let index = -1
                for (let i = 0; i < a.arrayOfScores.length; i++) {
                    if (a.arrayOfScores[i].match === matchKey) {
                        index = i
                    }
                }
                if (index >= 0) {
                    let tempClimb = climbAvg.finalizeResults().array[index].value
                    if (tempClimb === 2) {

                        tempClimb = 10
                    }
                    else if (tempClimb === 1) {
                        tempClimb = 8
                    }
                    else {
                        tempClimb = 0
                    }
                    let totalThisMatch = a.arrayOfScores[index].value

                    let pieChart = { "coneOne": (oneCone.finalizeResults().array[index].value * 2) / totalThisMatch, "coneTwo": (twoCone.finalizeResults().array[index].value * 3) / totalThisMatch, "coneThree": (threeCone.finalizeResults().array[index].value * 5) / totalThisMatch, "cubeOne": (oneCube.finalizeResults().array[index].value * 2) / totalThisMatch, "cubeTwo": (twoCube.finalizeResults().array[index].value * 3) / totalThisMatch, "cubeThree": (threeCube.finalizeResults().array[index].value * 5) / totalThisMatch, "climb": tempClimb / totalThisMatch }
                    a.pieChart = pieChart
                }
            }
        

    }


    runAnalysis() {

        return new Promise(async (resolve, reject) => {
            let a = this
            await a.getAccuracy().catch((err) => {
                if (err) {
                    console.log(err)
                }
            })
            resolve("done")
        })

    }
    finalizeResults() {
        return {

            "scoringBreakdown": this.pieChart,
            "all" : this.all,
            "difference" : this.difference,
            "result" : this.averageScore,
            "array" : this.arrayOfScores,
            "team": this.team
        }
    }

}
module.exports = scoringBreakdown
