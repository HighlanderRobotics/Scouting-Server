const fs = require('fs')
const Papa = require('papaparse')
const DatabaseManager = require('../DatabaseManager.js')
const { addScouters } = require('../manager/dbmanager.js')

const scouters = JSON.parse(fs.readFileSync(`./scouters/scouters.json`, 'utf8')).scouters
const availability = Papa.parse(fs.readFileSync('./scouters/Availability.csv', 'utf8'), { header: true }).data
const version = JSON.parse(fs.readFileSync(`./scouters/scoutersSchedule.json`, 'utf8')).version + 1

const tournamentKey = '2022cc'
const shiftSize = 5
const busy = ['Vaughn Khouri', 'Alex Ware', 'Reece Beck', 'Peter Stokes']


run = async () => {
    const matches = await new DatabaseManager().runTask('getMatches', tournamentKey)
    let viables = []
    let recents = []

    let newData = {
        'version': version,
        'matches': []
    }

    availability.forEach(scouter => {
        if (scouter.availability === 'Yes') {
            viables.push(scouter.name)
        } else if (scouter.availability === 'Maybe') {
            console.log(`Confirm with: ${scouter.name}`)
        }
    })

    for (var i = 0; i < (matches.length/6)/shiftSize; i++) {
        if (i+shiftSize > matches.length/6) {
            newData.matches[i] = {
                'start': i*shiftSize + 1,
                'end': (matches.length/6),
                'scouts': []
            }
        } else {
            newData.matches[i] = {
                'start': i*shiftSize + 1,
                'end': (i*shiftSize + shiftSize),
                'scouts': []
            }
        }

        while (newData.matches[i].scouts.length < 6) {
            var possibleScout = viables[Math.floor(Math.random() * (viables.length))]
            

            if (
                !recents.includes(possibleScout) && 
                !busy.includes(possibleScout) && 
                !newData.matches[(i - 2) < 0 ? 0 : i].scouts.includes(possibleScout)
                ) {

                newData.matches[i].scouts.push(possibleScout)

                recents.push(possibleScout)
            }
        }

        recents = []
    }

    console.log('Writing to file')
    fs.writeFileSync('./scoutersSchedule.json', JSON.stringify(newData), 'utf8', (err) => {
        if (err) {
            return 'Error writing to scouters file'
        }
    })    
}

run()