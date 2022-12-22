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
        constantData: {
            scouterId: 1,
            matchNumber: parseInt(data.matchNumber),
            defenseQuantity: parseInt(data.defense),
            defenseQuality: parseInt(data.defense),
            startTime: timestamp,
            notes: data.notes
        },
        gameDependent: {
            autoHighSuccess: parseInt(data.autoHighSuccess),
            autoMisses: parseInt(data.autoMisses),
            teleopHighSuccess: parseInt(data.teleopHighSuccess),
            teleopMisses: parseInt(data.teleopMisses),
            climberPosition: 'No Climb',
        }
        
    }

    // console.log(data)
    Manager.addScoutReport(teamKey, tournamentKey, data)
}
