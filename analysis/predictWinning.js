const BaseAnalysis = require('./BaseAnalysis.js')
const math = require('jstat')

class predictWinning extends BaseAnalysis {
    static name = `predictWinning`

    constructor(db, red1, red2, red3, blue1, blue2, blue3,) {
        super(db)
        this.red1 = red1
        this.red2 = red2
        this.red3 = red3
        this.blue1 = blue1
        this.blue2 = blue2
        this.blue3 = blue3
        // this.notes = []
        // this.scoresOverTime = []
        // this.defenseQuantity = 0
        // this.defenseQuality = 0
        // this.ballCount = 0
        // this.autoCount = 0
        this.result = 0
    }
    async getWinner()
    {
        let a = this
        return new Promise(function(resolve, reject)
        {
            if(err)
            {
                reject(err);
            }
             
            
                red1SDV = math.std(red1)
                red2SDV = math.std(red2)
                red3SDV = math.std(red3)
                
                
            
                redAllianceSDV = Math.sqrt(Math.pow(red1SDV, 2) + Math.pow(red2SDV, 2) + Math.pow(red3SDV, 2))
                redAllianceMean = getMean(red1) + getMean(red2) + getMean(red3)
            
                blue1SDV = math.std(blue1)
                blue2SDV = math.std(blue2)
                blue3SDV = math.std(blue3)
            
                blueAllianceSDV = Math.sqrt(Math.pow(blue1SDV, 2) + Math.pow(blue3SDV, 2) + Math.pow(blue2SDV, 2))
                blueAllianceMean = getMean(blue1) + getMean(blue2) + getMean(blue3)
            
                differentialSDV = Math.sqrt(Math.pow(redAllianceSDV, 2) + Math.pow(blueAllianceSDV, 2))
                differentialMean = redAllianceMean - blueAllianceMean
                
                redLoosing =   GetZPercent((0 - differentialMean)/ differentialSDV)
                resolve(1- redLoosing)
            
                
            })
    
    }
    async GetZPercent(z) 
            {
                return new Promise(function(resolve, reject)
                {
                    if(err)
                    {
                        reject(err);
                    }
                    if ( z < -6.5)
                        resolve(0.0);
                    if( z > 6.5) 
                        resolve(1.0);
                
                    var factK = 1;
                    var sum = 0;
                    var term = 1;
                    var k = 0;
                    var loopStop = Math.exp(-23);
                    while(Math.abs(term) > loopStop) 
                    {
                        term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
                        sum += term;
                        k++;
                        factK *= k;
                
                    }
                    sum += 0.5;
                
                    resolve(sum);
                })
                //z == number of standard deviations from the mean
            
                //if z is greater than 6.5 standard deviations from the mean
                //the number of significant digits will be outside of a reasonable 
                //range
                
        }
    async getMean(teamArray)
    {
            return new Promise(function(resolve, reject)
            {
               
                var total = 0;
                for(var i = 0; i < teamArray.length; i++) {
                    total += teamArray[i];
                }
                resolve(total / teamArray.length);
            })
    
        
    }
    async getMean(teamArray)
      {
         var total = 0;
          for(var i = 0; i < teamArray.length; i++) {
                 total += teamArray[i];
            }
               return total / teamArray.length;
        }
    runAnalysis()
    {
        return new Promise(async (resolve, reject) =>
        {
            var temp = a.getWinner().catch((err) => {
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
            "red1": this.red1, 
            "red2": this.red2,
            "red3": this.red3,
            "blue1" : this.blue1,
            "blue2" : this.blue2,
            "blue3" : this.blue3,
            "result": this.result
        }
    }
}
module.exports = predictWinning