const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()



app.listen(3000, () => {
    let downloadingInfo = FileManager.readFile(__dirname, 'downloading-info.json')
    if(downloadingInfo) {
        // TODO: O que fazer caso consiga ler as informações do anime a baixar?
        FileManager.createFolderIfNotExist(`${__dirname}/downloads/`)
        FileManager.downloadFile('https://s2.lightspeedst.net/s2/mp4/kenka-dokugaku/hd/6.mp4', `./downloads/${downloadingInfo.name}/video.mp4`)
            .then(() => console.log('Download concluído!'))
            .catch(console.error);
    }
})