const BaseAnalysis = require('./BaseAnalysis.js')
const defenseQualityAll = require('./defenseQualityAll.js')


class defenseQuality extends BaseAnalysis {
    static name = `defenseQuality`

    constructor(db, teamKey) {
        super(db)
        this.team = teamKey
        // this.start = start
        // this.end = end
        // this.result = 0
        this.difference = 0
        this.average = 0
        this.array = []
    }
    async getDefenseQuality()
    {
        let a = this
        return new Promise(async function(resolve, reject)
        {
            let currArray = []
            let sql = `SELECT defenseQuality
            FROM data
            JOIN (SELECT matches.key
                FROM matches 
                JOIN teams ON teams.key = matches.teamKey
                WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
            `
            await a.db.all(sql, [a.team], (err, row)=>{
                if(err)
                {
                    reject(err)
                }
                let arr = []
                row.forEach(functionAdder);
                    function functionAdder(rows, index, array){
                            arr.push(rows.defenseQuality)
                    }
                const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
                a.average = sum/arr.length
                a.array = arr
                
                // console.log(a.average)
                // console.log(a.array)

                
                resolve("done")
            })
        })
    }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            let a = this
            await a.getDefenseQuality().catch((err) => {
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
            "result": this.average,
            "array": this.array,
            "team": this.team
        }
    }
}
module.exports = defenseQuality