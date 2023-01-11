const BaseAnalysis = require('./BaseAnalysis.js')

class climberMax extends BaseAnalysis {
    static name = `climberMax`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.start = start
        // this.end = end
        this.result = 0
        this.array = []
        
    }
    async getClimberMax()
    {
        let a = this
        return new Promise(async(resolve, reject) =>
        {
            let arr = []
           
            var sql = `SELECT scoutReport
                FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
              `
              let max = 0

            a.db.all(sql, [a.team], (err, rows) =>
            {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                else
                {
                    // console.log(row)

                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                        let curr = JSON.parse(row.scoutReport)
                        arr.push(curr.challengeResult)
                        if(curr.challengeResult > max)
                        {
                            max = curr.challengeResult
                        }
                        
                       
                    }
                

            }
            a.result = max
            a.array = arr
            resolve("done")
                

        })
        
    })
    }
    runAnalysis()
        {
            return new Promise(async (resolve, reject) =>
            {
                // console.log("here")
                let a = this
                var temp = await a.getClimberMax().catch((err) => {
                    if (err) {

                        console.log(err)
                        return err
                    }
                })  
                resolve("done")        
            })
            
        }
        finalizeResults()
        {
            return { 
                "result": this.result,
                "team": this.team
            }
        }

}
module.exports = climberMax
