const BaseAnalysis = require('./BaseAnalysis.js')



class picklist extends BaseAnalysis {
    static name = `picklist`

    constructor(db) {
        super(db)

        this.result = []
        
    }
    async getPicklist()
    {
       
       //state machine for different metrics
        //loop through all teams once: find deviation from mean (use the difference file)
       //after loop get average deviation
       //then loop through again: get z-score and put into converter methodd from stack overflow (that teams devation/standard devation [caluclated above])
        //repeat for all metrics, and put coefficents
        //rank and return        
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
                // a.result = temp  
                resolve("done")        
            })
            
        }
        finalizeResults()
        {
            return { 
                "result": this.result
                        }
        }

}
module.exports = picklist
