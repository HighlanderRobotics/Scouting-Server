const Manager = require('../manager/dbmanager.js')
const BaseAnalysis = require('./BaseAnalysis.js')


class fullyScouted extends BaseAnalysis {
    static name = `fullyScouted`

    constructor(db, tournamentKey, matchNum) {
        super(db)
        this.tournamentKey = tournamentKey
        this.matchNumber = matchNum
        this.result = false
    }
    async getFullyScouted()
    {
        let a = this
        return new Promise(function(resolve, reject)
        {
            let sql = `SELECT COUNT(*) AS rowCount
            FROM matches
            WHERE tournamentKey = ? AND matchNumber  = ?`
            a.db.all(sql, [a.tournamentKey, a.matchNumber], (err, rows) =>
            {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                a.result = rows.rowCount == 6
                resolve(a.result)
                
            })
        })
    }
    runAnalysis()
    {
        let a = this

        return new Promise(async (resolve, reject) =>
        {
            var temp = a.getFullyScouted().catch((err) => {
                if (err) {
                    return err
                }
            })  
            a.result = temp          
        })
        
    }
    finalizeResults()
    {
        return { 
            "result": this.result,
            "matchNumber": this.matchNumber
        }
    }
}
module.exports = fullyScouted
