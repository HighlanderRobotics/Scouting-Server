const fs = require('fs');
// const { run } = require('jest');
const Papa = require('papaparse')
const DatabaseManager = require('../DatabaseManager.js')

const file = './test-data/chezyData.csv'
const csvData = fs.readFileSync(file, 'utf8');

const jsonData = Papa.parse(csvData, { header: true });

const tournamentKey = '2022cc'


let run = async () => {
    for(i = 0; i < jsonData.data.length; i ++)
    {
        

        var timestamp = new Date(jsonData.data[i].timeStamp)
        timestamp = Date.parse(timestamp)
        data = jsonData.data[i]
        teamKey = `frc${data.teamNumber}`


        await new DatabaseManager().runTask('addScoutReport', {
            body: {
                /* Constant data */
                teamNumber: data.teamNumber,
                competitionKey: tournamentKey,
                
                uuid: i,
                scouterName: 'Joe',
                matchNumber: parseInt(data.matchNumber),
                defenseFrequencyRating: parseInt(data.defense),
                overallDefenseRating: parseInt(data.defense),
                startTime: timestamp,
                notes: data.notes,

                /* Game dependent data */
                autoHighSuccess: parseInt(data.autoHighSuccess),
                autoMisses: parseInt(data.autoMisses),
                teleopHighSuccess: parseInt(data.teleopHighSuccess),
                teleopMisses: parseInt(data.teleopMisses),
                challengeResult: 'No Climb',
            }
            
        })
    }
}

run()
