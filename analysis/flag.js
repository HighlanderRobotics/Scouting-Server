const BaseAnalysis = require('./BaseAnalysis.js')
const trend = require('./trend.js')
const penalty = require('./general/penalties.js')
const role = require('./general/robotRole.js')
const rank = require('../manager/getRankOfTeam.js')
const math = require('mathjs')
const categoryMetrics = require('./categoryMetrics.js')
const Manager = require('../manager/Manager.js')

class flag extends BaseAnalysis {
    static name = `flag`

    constructor(db, team, typeArr, tournamentKey) {
        super(db)
        this.team = team
        this.result = null
        this.typeArr = typeArr
        this.tournamentKey = tournamentKey
    }
    async getFlag() {

        let a = this
        let arr = []
        for (let i = 0; i < a.typeArr.length; i++) {

            let type = a.typeArr[i]
            if (type === "trend") {
                let temp = new trend(a.db, a.team)
                await temp.runAnalysis()
                arr.push({"type" : type, "result" : temp.finalizeResults().result})
            }
            else if (type === "pentalties") {

                let temp = new penalty(a.db, a.team)
                await temp.runAnalysis()
                if (temp.finalizeResults().result === 0) {
                    arr.push({"type" : type, "result" : 0})
                }
                else {
                    arr.push({"type" : type, "result" : temp.finalizeResults().matches[temp.finalizeResults().matches.length - 1].cardType})
                }
            }

            else if (type === "mainRole") {
                let temp = new role(a.db, a.team)
                await temp.runAnalysis()
                arr.push({"type" : type, "result" :  temp.finalizeResults().mainRole})
            }
            else if (type === "ranking") {
                let teamKey = "frc" + a.team
                arr.push({"type" : type, "result" : await new rank().runTask(teamKey, a.tournamentKey)})
            }
            else {
                let metrics = new categoryMetrics(Manager.db, a.team)
                await metrics.runAnalysis()
                arr.push({"type" : type, "result" : metrics.result.metrics[type]})

            }
        }
        a.result = arr

    }



    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.getFlag().catch((err) => {

            })
            resolve("done")
        })


    }

    finalizeResults() {
        return {
            "team": this.team,
            "result": this.result
        }
    }
}

module.exports = flag