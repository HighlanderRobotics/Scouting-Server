const BaseAnalysis = require('./BaseAnalysis.js')

class averageScore extends BaseAnalysis {
    static name = `averageScore`

    constructor(db, team) {
        super(db)
        this.team = team
        // this.start = start
        // this.end = end
        this.array = []
        this.average = 0
    }
    async scoresOverTime()
    {
        let a = this
        return new Promise(function(resolve, reject)
        {
            var sql = `SELECT scoutReport
            FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
            let answer = []
            
            a.db.all(sql, [a.team], (err, rows) =>
            {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                else
                {
                    rows.forEach(functionAdder);
                    function functionAdder(row, index, array){
                        let data = JSON.parse(row.scoutReport)
                        
                        let total = 2 
                        if(data.challengeResult == 2)
                        {
                            total += 4
                        }
                        else if(data.challengeResult == 3)
                        {
                            total += 6
                        }
                        else if(data.challengeResult == 4)
                        {
                            total += 10
                        }
                        else if(data.challengeResult == 5)
                        {
                            total += 15
                        }
                        let arr = data.events
                        for (let i = 0; i < arr.length; i++) {
                            
                            const entry = arr[i];
                            if(entry[0] <= 3000 && entry[1] === 0)
                            {
                                total += 4
                            }
                            else if(entry[1] === 0)
                            {
                                total += 2
                            }
                            
                        }
                        console.log(total)
                        
                        answer.push(total)

                       
                    }
                
        
                }
                
                // a.result = arr
                a.array = answer
                const sum = answer.reduce((partialSum, a) => partialSum + a, 0)
                a.average = sum/answer.length
             
                resolve("done")

            })
        })
    }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            let a = this
            var temp = await a.scoresOverTime().catch((err) => {
                if (err) {
                    return err
                }
            })  
            // a.result = temp  
            resolve("done")        
        })
        
    }
    finalizeResults()
    {
        return { 
            "result" : this.average,
            "array": this.array,
            "team": this.team,
        }
    }
}
module.exports = averageScore