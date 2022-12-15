const BaseAnalysis = require('./BaseAnalysis.js')

class defenseQuality extends BaseAnalysis {
    static name = `defenseQuantity`

    constructor(db, teamKey) {
        super(db)
        this.team = teamKey
        this.result = 0
    }
    async getDefenseQuantity()
    {
        let a = this
        return new Promise(function(resolve, reject)
        {
            let sql = `SELECT SUM(defenseQuantity) AS dSum, COUNT(*) AS size
            FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
            db.all(sql, [a.team], (err, row)=>{
                if(err)
                {
                    reject(err)
                }
                let temp = ow[0].dSum / row[0].size
                a.result = temp
                resolve(temp)
            })
        })
    }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            var temp = a.getDefenseQuantity().catch((err) => {
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
            "defenseQuantity": this.result,
            "team": this.team
        }
    }
}