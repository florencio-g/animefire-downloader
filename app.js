const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()



app.listen(3000, async () => {
    let downloadingInfo = FileManager.readFile(__dirname, 'downloading-info.json')
    if(downloadingInfo) {
        FileManager.createFolderIfNotExist(`${__dirname}/downloads/${downloadingInfo.name}`)

        for (let index = downloadingInfo.start; index <= downloadingInfo.end; index++) {
            await FileManager.downloadFile(`https://lightspeedst.net/s2/mp4/one-piece/sd/${index}.mp4`, `./downloads/${downloadingInfo.name}/${downloadingInfo.name} - Episódio ${index < 10 ? '0' + index : index}.mp4`)
                .then(() => console.log('Download concluído!'))
                .catch(console.error);
        }
    }
})