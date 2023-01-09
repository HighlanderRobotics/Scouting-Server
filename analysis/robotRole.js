const { image } = require('d3')
const { help } = require('mathjs')
const BaseAnalysis = require('./BaseAnalysis.js')

class climberSucsess extends BaseAnalysis {
    static name = `climberSucsess`

    constructor(db, team) {
        super(db)
        this.team = team
        this.teamKey = "ftc" + team
        // this.start = start
        // this.end = end
        this.defense = 0
        this.offense = 0
        this.helper = 0
        this.array = []
        this.mixed = 0
        
    }
    async getData()
    {
        let a = this
        return new Promise(async(resolve, reject) =>
        {
            //why does await not work when it works in  bestAverageForMetric
            var sql = `SELECT scoutReport
                    FROM data
                JOIN (SELECT matches.key, matches.matchNumber
                    FROM matches 
                    JOIN teams ON teams.key = matches.teamKey
                    WHERE teams.teamNumber = ?) AS  newMatches ON  data.matchKey = newMatches.key
                `;
            let helper = 0
            let offense = 0
            let defense = 0
            let mixed = 0
            let arr = []

            this.db.all(sql, [a.team], (err, rows) =>
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
                        let curr = JSON.parse(row.scoutReport).robotRole
                        arr.push(curr)
                        if(curr === 3)
                        {
                            helper ++
                        }
                        if(curr === 1)
                        {
                            offense ++
                        }
                        if(curr === 0)
                        {
                            defense ++
                        }
                        if(curr === 2)
                        {
                            mixed ++
                        }
                        
                    }
                    a.offense = offense/arr.length
                    a.defense = defense/arr.length
                    a.helper = helper/arr.length
                    a.mixed = helper
                    a.array = arr

                    
                }
            })
           
            // console.log(all)
           
                

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
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            let a = this
            var temp = await a.getData().catch((err) => {
                if (err) {
                    console.log(err)
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
            "defense": this.defense,
            "offense" : this.offense,
            "mixed" : this.mixed,
            "helper" : this.helper,
            "team": this.team
        }
    }
}
module.exports = climberSucsess

