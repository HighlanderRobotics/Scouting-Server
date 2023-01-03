const BaseAnalysis = require('./BaseAnalysis.js')

class defenseQuantity extends BaseAnalysis {
    static name = `defenseQuantity`

    constructor(db, teamKey) {
        super(db)
        this.team = teamKey
        // this.start = start
        // this.end = end
        // this.result = 0
        this.average = 0
        this.array = []
    }
    async getDefenseQuantity()
    {
        let a = this
        return new Promise(async function(resolve, reject)
        {
            let currArray = []
            let sql = `SELECT defenseQuantity
            FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
            `
            a.db.all(sql, [a.team], (err, row)=>{
                if(err)
                {
                    reject(err)
                }
                let arr = []
                row.forEach(functionAdder);
                    function functionAdder(rows, index, array){
                            arr.push(rows.defenseQuantity)
                    }
                const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
                a.average = sum/arr.length
                a.array = arr
                // console.log(a.average)
                // console.log(a.array)

                
            })
            resolve("done")
        })
    }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            let a = this
            await a.getDefenseQuantity().catch((err) => {
                if (err) {
                    return err
                }
            })  
            resolve("done")        
        })
        
    }
    finalizeResults()
    {
        return { 
            "defenseQuantityAverage": this.average,
            "defenseQuantityArray": this.array,
            "team": this.team
        }
    }
}
module.exports = defenseQuantity