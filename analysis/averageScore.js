const BaseAnalysis = require('./BaseAnalysis.js')

class notes extends BaseAnalysis {
    static name = `averageScore`

    constructor(db, team) {
        super(db)
        this.team = team
        this.result = []
    }
    async scoresOverTime()
    {
        let a = this
        return new Promise(function(resolve, reject)
        {
            var sql = `SELECT json_extract(json(trim(json_extract(data.scoutReport, '$.gameDependent'), '"')), '$.autoHighSuccess') as autoHigh, CAST(replace(json_extract(json(trim(json_extract(data.scoutReport, '$.gameDependent'), '"')), '$.teleopHighSuccess'), '"', '') AS INTEGER) as teleopHigh, json_extract(json(trim(json_extract(data.scoutReport, '$.gameDependent'), '"')), '$.climberPosition') AS climb
            FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key`
                let arr = []
            let total = 0
            
            db.all(sql, [a.team], (err, rows) =>
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
                        let shots = 0
                        let total = 0
                        for (let i = 0; i < arr.length; i++) {
                            let curr = arr[i][1]
                            if (curr == 0) {
                              shots++;
                            }
                            if(curr == 2)
                            {
                                total += 4
                            }
                            if(curr == 3)
                            {
                                total += 6
                            }
                            if(curr == 4)
                            {
                                total += 10
                            }
                            if(curr == 5)
                            {
                                total += 15
                            }
                        }
                        total += shots * 2

                    }
                
        
                }
                a.result = arr
                resolve(arr)

            })
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
            resolve(temp)        
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