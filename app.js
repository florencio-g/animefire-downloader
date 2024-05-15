const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()



app.listen(3000, () => {
    let downloadingInfo = FileManager.readFile(__dirname, 'downloading-info.json')
    if(downloadingInfo) {
        // TODO: O que fazer caso consiga ler as informações do anime a baixar?
    }
})