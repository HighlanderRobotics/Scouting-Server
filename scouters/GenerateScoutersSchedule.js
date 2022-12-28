const fs = require('fs')
const Papa = require('papaparse')
const DatabaseManager = require('../DatabaseManager.js')
const { addScouters } = require('../manager/dbmanager.js')

const scouters = JSON.parse(fs.readFileSync(`./scouters/scouters.json`, 'utf8')).scouters
const availability = Papa.parse(fs.readFileSync('./scouters/Availability.csv', 'utf8'), { header: true }).data
let version = 1
let previous = fs.readFileSync(`./scouters/scoutersSchedule.json`, 'utf8')
if (undefined != previous && previous.includes('version')) {
    console.log(`exists`)
    version = JSON.parse(previous).version + 1
}

const tournamentKey = '2022cc'
const shiftSize = 5
const busy = ['Vaughn Khouri', 'Alex Ware', 'Reece Beck', 'Peter Stokes']


run = async () => {
    const matches = await new DatabaseManager().runTask('getMatches', tournamentKey)
    let viables = []
    let recents = []

    let newData = {
        'version': version,
        'shifts': []
    }

    availability.forEach(scouter => {
        if (scouter.availability === 'Yes') {
            viables.push(scouter.name)
        } else if (scouter.availability === 'Maybe') {
            console.log(`Confirm with: ${scouter.name}`)
        }
    })

    for (var i = 0; i < (shifts.length/6)/shiftSize; i++) {
        if (i+shiftSize > shifts.length/6) {
            newData.shifts[i] = {
                'start': i*shiftSize + 1,
                'end': (shifts.length/6),
                'scouts': []
            }
        } else {
            newData.shifts[i] = {
                'start': i*shiftSize + 1,
                'end': (i*shiftSize + shiftSize),
                'scouts': []
            }
        }

        while (newData.shifts[i].scouts.length < 6) {
            var possibleScout = viables[Math.floor(Math.random() * (viables.length))]
            
            if (
                !newData.shifts[(i)].scouts.includes(possibleScout)
                && !busy.includes(possibleScout)
                && !newData.shifts[(i-1) < 0 ? 0 : i-1].scouts.includes(possibleScout)
            ) {
                newData.shifts[i].scouts.push(possibleScout)
            }
        }

    }

    console.log('Writing to file')
    fs.writeFileSync('scouters/./scoutersSchedule.json', JSON.stringify(newData), 'utf8', (err) => {
        if (err) {
            return 'Error writing to scouters file'
        }
        console.log('written')
    })    
}

run()