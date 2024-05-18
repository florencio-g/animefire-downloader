const fs = require('fs');
const axios = require('axios');

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
    static writeFile(path, filename, data) {
        try {
            fs.writeFileSync(`${path}/${filename}`, data, 'utf8')
        } catch (error) {
            return false
        }
    }
    static downloadFile(url, path, name) {
        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(path);
            let receivedBytes = 0;

            axios({
                method: 'get',
                url: url,
                responseType: 'stream'
            })
                .then(response => {
                    const totalBytes = response.headers['content-length'];

                    response.data.on('data', (chunk) => {
                        receivedBytes += chunk.length;
                        let percentComplete = ((receivedBytes / totalBytes) * 100).toFixed(2);
                        console.log(`Baixado ${name ?? '[anime]'} ${(receivedBytes / 1024 / 1024).toFixed(2)}/${(totalBytes / 1024 / 1024).toFixed(2)} Mb (${percentComplete}%)`);
                    });

                    response.data.pipe(writer);

                    writer.on('finish', resolve);
                    writer.on('error', reject);
                })
                .catch(() => reject());
        });

    }
    static createFolderIfNotExist(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

    }

}


module.exports = FileManager