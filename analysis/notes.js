const BaseAnalysis = require('./BaseAnalysis.js')

class notes extends BaseAnalysis {
    static name = `notes`

    constructor(db, team) {
        super(db)
        this.team = team
        this.result = []
    }
    async getNotes()
    {
        let a = this
        return new Promise(function(resolve, reject)
        {
                var sql = `SELECT notes, newMatches.matchNumber AS matchNum
                FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
                let arr = []
                db.all(sql, [a.team], (err, rows) => {
                    if(err)
                    {
                        reject(err)
                    }
                    else
                    {                    
                        a.result = rows
                        resolve(rows)
                    }
            })
                

        })
    }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            var temp = a.getNotes().catch((err) => {
                if (err) {
                    return err
                }
            })  
            a.result = temp   
            resolve(temp)       
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