const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()


async function main() {
    let downloadingInfo = FileManager.readFile(__dirname, 'downloading-info.json')
    if (downloadingInfo) {
        FileManager.createFolderIfNotExist(`${__dirname}/downloads/${downloadingInfo.name}`)

        for (let index = downloadingInfo.start; index <= downloadingInfo.end; index++) {
            var url = `https://lightspeedst.net/s2/mp4/one-piece/sd/${index}.mp4`
            var path = `./downloads/${downloadingInfo.name}/${downloadingInfo.name} - Episódio ${index < 10 ? '0' + index : index}.mp4`
            var name = downloadingInfo.name + ' EP ' + index + ' -'

            await FileManager.downloadFile(url, path, name)
                .then(() => {
                    console.log('Download concluído!')
                    downloadingInfo.start += 1
                    FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(downloadingInfo))
                })
                .catch(() => {
                    console.clear()
                    console.log(`Não foi possível baixar o EP ${index} de ${downloadingInfo.name}.`)
                    downloadingInfo.start += 1
                    downloadingInfo.noDownloaded.push(index)
                    downloadingInfo.noDownloaded.includes(index) ? downloadingInfo : downloadingInfo.noDownloaded.push(index)
                    FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(downloadingInfo))
                });
        }
    }
}

app.listen(3000, (error) => {
    if(!error) {
        main()
    }
})