const sqlite = require('sqlite3').verbose()

class Manager {
    static db = new sqlite.Database(`${__dirname}/.././test.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, (err) => {
        if (err)
            console.error(err);
    });

    constructor() {
    }
    
    runTask(task) {
        throw new Error(`Method 'runTask()' must be implemented.`)
    }
}

module.exports = Manager