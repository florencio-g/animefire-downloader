const fs = require('fs');

class FileManager {
    constructor() {

    }

    readFile(path, filename) {
        try {
            const data = fs.readFileSync(`${path}/${filename}`, 'utf8')
            return data
        } catch (error) {
            throw 'Erro ao encontrar ler ou arquivo não encontrado.'
        }
    }
    writeFile(path, filename) {

    }
}


module.exports = FileManager