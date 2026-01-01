const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()

// Settings
app.set('view engine', 'ejs')
app.set('views', './views')

// Middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Functions
async function startDownload() {
    let downloadFile = FileManager.readFile(__dirname, 'download-log.json')
    if (downloadFile) {

        await downloadFile.list.map(async function (anime) {
            FileManager.createFolderIfNotExist(`${__dirname}/downloads/${anime.name}`)

            for (let index = anime.start; index <= anime.end; index++) {
                await downloadEpisodes(anime, index);
                FileManager.writeFile(__dirname, 'download-log.json', JSON.stringify(downloadFile));
            }
        })
    }
}

async function downloadEpisodes(anime, index) {
    const qualidades = [
        { q: 'fhd', folder: 'F-HD' },
        { q: 'hd', folder: 'HD' },
        { q: 'sd', folder: 'SD' }
    ];

    const url = quality => `${anime.url}/${quality}/${index}.mp4`;
    const path = folder => `./downloads/${anime.name}/${anime.name} - EP ${index < 10 ? '0' + index : index} (${folder}).mp4`;
    const name = anime.name + ' EP ' + index + ' - ';

    for (const { q, folder } of qualidades) {
        try {
            await FileManager.downloadFile(url(q), path(folder), name);
            //TODO: Log de download concluído
            anime.start++;
            return;
        } catch (e) {}
    }
    //TODO: Log de falha no download
    anime.start++;
    if (!anime.noDownloaded.includes(index)) anime.noDownloaded.push(index);
}


// Routes
app.get('/', async (req, res) => {
    res.render('index')
})

app.listen(3000, async (error) => {
    if (!error) {
        console.log("Servidor iniciado na porta 3000")
    }
})
