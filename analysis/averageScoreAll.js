const BaseAnalysis = require('./BaseAnalysis.js')
const averageScore = require('./averageScore.js')

// const Manager = require('./manager/dbmanager.js')

class averageScoreAll extends BaseAnalysis {
    static name = `averageScoreAll`

    constructor(db) {
        super(db)
        // this.team = team
        // this.teamKey = "frc" + team
        // this.start = start
        // this.end = end
        this.average
        
    }
    async getAccuracy()
    {
        let a = this
        return new Promise(async function(resolve, reject)
        {
            var sql = `SELECT teamNumber
            FROM teams`
            let arr = []

            a.db.all(sql, [], (rows, err) =>
            {
                rows.forEach(functionAdder);
                function functionAdder(row, index, array){
                    arr.push(a.getAvg(team))
                }
                const sum = arr.reduce((partialSum, a) => partialSum + a, 0)
                a.average = sum/arr.length


            })
            resolve("done")

                    // console.log(makes/len)

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
        async getAvg(team)
        {
            let temp = new averageScore(a.db, team)
            await temp.runAnalysis()
            return temp.average
        }
    
        runAnalysis()
        {
            return new Promise(async (resolve, reject) =>
            {
                let a = this
                var temp = await a.getAccuracy().catch((err) => {
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
                "result": this.average,
                // "team": this.team
            }
        }

}
module.exports = averageScoreAll
