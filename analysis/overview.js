const BaseAnalysis = require('./BaseAnalysis.js')
const Manager = require('./dbmanager.js')
const AverageForMetric = require('./analysis/AverageForMetric.js')
const TeamsInTournament = require('./analysis/TeamsInTournament.js')
const BestAverageForMetric = require('./analysis/BestAverageForMetric.js')
const Overveiw = require('./overview.js')
const FullyScouted = require('./fullyScouted.js')
const defenseAmmount = require('defenseQuantity.js')
const defenseQuality = require('defenseQuality.js')
const notes = require('notes.js')

class overview extends BaseAnalysis {
    static name = `teamOverveiw`

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
    async getOverview()
    {
        let a = this
        return new Promise(async(resolve, reject) =>
        {
            //why does await not work when it works in  bestAverageForMetric
            let result = {}
            var defenseFreq = new defenseAmmount(a.db, s.team)
                await teamAverage.runAnalysis()
            result.defesenQuantity = defenseFreq.finalizeResults()
            var defenseQaul = new defenseQuality(a.db, s.team)
                await defenseQaul.runAnalysis()
            result.defenseQuality = defenseQaul.finalizeResults()
            var note = new notes(a.db, s.team)
                await defenseQaul.runAnalysis()
            result.note = defenseQaul.finalizeResults()
            
           
                

        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((data) => {
            // console.log(data)
            return data
        })
    }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            var temp = a.getDefenseQuality().catch((err) => {
                if (err) {
                    return err
                }
            })  
            a.result = temp      
            resolve("done")    
        })
        
    }
    finalizeResults()
    {
        return { 
            "notes": this.result,
            "team": this.team
        }
    }
}