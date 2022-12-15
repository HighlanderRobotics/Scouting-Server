const BaseAnalysis = require('./BaseAnalysis.js')


class fullyScouted extends BaseAnalysis {
    static name = `fullyScouted`

    constructor(db, gameKey, matchNum) {
        super(db)
        this.gameKey = gameKey
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
            WHERE gameKey = ? AND matchNumber  = ?`
            db.all(sql, [a.gameKey, a.matchNumber], (err, rows) =>
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
        return new Promise(async (resolve, reject) =>
        {
            var temp = a.fullyScouted().catch((err) => {
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
            "defenseQuantity": this.result,
            "matchNumber": this.matchNumber
        }
    }
}