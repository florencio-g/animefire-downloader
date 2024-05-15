const fs = require('fs');

class FileManager {
    constructor() {

    }

    static readFile(path, filename) {
        try {
            const data = fs.readFileSync(`${path}/${filename}`, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            return false
        }
    }
    static writeFile(path, filename) {

    }
}


module.exports = FileManager