const fs = require('fs')
const Papa = require('papaparse')
const Manager = require('../manager/./dbmanager.js')

const file = './test-data/chezyData.csv'
const csvData = fs.readFileSync(file, 'utf8');

const jsonData = Papa.parse(csvData, { header: true });

const tournamentKey = '2022cc'


for(i = 0; i < jsonData.data.length; i ++)
{
    

    var timestamp = new Date(jsonData.data[i].timeStamp)
    timestamp = Date.parse(timestamp)
    data = jsonData.data[i];
    teamKey = `frc${data.teamNumber}`;
    
    var data = {
        /* Constant data */
        uuid: i,
        scouterId: 1,
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

    // console.log(data)
    Manager.addScoutReport(teamKey, tournamentKey, data)
}
