const express = require('express')
const FileManager = require('./modules/file-manager');
const app = express()


async function main() {
    let downloadFile = FileManager.readFile(__dirname, 'downloading-info.json')
    if (downloadFile) {

        console.log(downloadFile.list);

        await downloadFile.list.map(async function (anime) {
            FileManager.createFolderIfNotExist(`${__dirname}/downloads/${anime.name}`)

            for (let index = anime.start; index <= anime.end; index++) {
                await baixarEpisodio(anime, index);
                FileManager.writeFile(__dirname, 'downloading-info.json', JSON.stringify(downloadFile));

            }
        })
    }
}

async function baixarEpisodio(anime, index) {
    const qualidades = [
        { q: 'fhd', pasta: 'F-HD' },
        { q: 'hd', pasta: 'HD' },
        { q: 'sd', pasta: 'SD' }
    ];

    const url = qualidade => `${anime.url}/${qualidade}/${index}.mp4`;
    const path = pasta => `./downloads/${anime.name}/${anime.name} - EP ${index < 10 ? '0' + index : index} (${pasta}).mp4`;
    const name = anime.name + ' EP ' + index + ' -';

    for (const { q, pasta } of qualidades) {
        try {
            await FileManager.downloadFile(url(q), path(pasta), name);
            console.log(`Download concluído! (${anime.name} EP ${index} - ${q.toUpperCase()})`);
            anime.start++;
            return;
        } catch (e) {
            // Tenta próxima qualidade
        }
    }
    // Se chegou aqui, falhou em todas as qualidades
    console.clear();
    console.log(`Não foi possível baixar o EP ${index} de ${anime.name}.`);
    anime.start++;
    if (!anime.noDownloaded.includes(index)) anime.noDownloaded.push(index);
}

app.listen(3000, async (error) => {
    if (!error) {
        main()
    }
})
