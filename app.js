const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()


async function main() {
    let downloadFile = FileManager.readFile(__dirname, 'downloading-info.json')
    if (downloadFile) {
        let downloadList = downloadFile.list

        for (const anime of downloadList) {
            FileManager.createFolderIfNotExist(`${__dirname}/downloads/${anime.name}`)

            for (let index = anime.start; index <= anime.end; index++) {
                var url = downloadQuality => `${anime.url}/${downloadQuality}/${index}.mp4`
                var path = downloadQuality => `./downloads/${anime.name}/${anime.name} - EP ${index < 10 ? '0' + index : index} (${downloadQuality}).mp4`
                var name = anime.name + ' EP ' + index + ' -'


                await FileManager.downloadFile(url('fhd'), path('F-HD'), name)
                    .then(() => {
                        console.log('Download concluído!')
                        anime.start += 1
                        FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(anime))
                    })
                    .catch(async () => {
                        await FileManager.downloadFile(url('hd'), path('HD'), name)
                            .then(() => {
                                console.log('Download concluído!')
                                anime.start += 1
                                FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(anime))
                            })
                            .catch(async () => {
                                await FileManager.downloadFile(url('sd'), path('SD'), name)
                                    .then(() => {
                                        console.log('Download concluído!')
                                        anime.start += 1
                                        FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(anime))
                                    })
                                    .catch(() => {
                                        console.clear()
                                        console.log(`Não foi possível baixar o EP ${index} de ${anime.name}.`)
                                        anime.start += 1
                                        anime.noDownloaded.includes(index) ? anime : anime.noDownloaded.push(index)
                                        FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(anime))
                                    })
                            })
                    });
            }
        }
    }
}

app.listen(3000, (error) => {
    if (!error) {
        main()
    }
})