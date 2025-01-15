const { app, BrowserWindow } = require('electron');
const path = require('path');
const ipc = require('electron').ipcMain;
const fs = require('fs');


let mainWindow;
let versionApp = "0.0.1"
let nameApp = "Atelier Electron - " + versionApp;

app.whenReady().then(() => {

    mainWindow = new BrowserWindow({
        frame: true,
        title: nameApp,
        width: 1318,
        height: 710,
        resizable: true,
        minWidth: 577,
        minHeight: 609,
        icon: path.join(__dirname, "assets/logo.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            webSecurity: true,
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.setMenuBarVisibility(false);

    // mainWindow.loadURL('http://useritium.fr/connect.php');
    mainWindow.loadFile('front/index.html');

    mainWindow.webContents.on('page-title-updated', () => {
        mainWindow.setTitle(nameApp);
    })

    console.log("App is ready");

})

let token = "azehaziuehazehzaeuazh";

ipc.on('hello', (event, pseudo) => {
    // console.log("Hey je viens du front");

    console.log('Jai recupere le token de : ' + pseudo);

    event.sender.send('getMyToken', token);


    /* CREATION DU DOSSIER*/

    let nouveauDossier = path.join(app.getPath('appData') + '/.myElectron');

    if (fs.existsSync(nouveauDossier)) {
        console.log("Dossier existe");
    } else {
        fs.mkdir(nouveauDossier, (err) => {
            if (err) throw err;
            console.log('Dossier cree !');
        })
    }


    /* ECRITURE DU FICHIER */

    let url = path.join(app.getPath('appData') + '/.myElectron/', "token.txt");

    // if (fs.existsSync(url)) {
    //     fs.rm(url, (err) => {
    //         if (err) throw err;
    //         console.log('Fichier supprime !');
    //     })
    // }

    fs.appendFile(url, token,
        function (err) {
            if (err) throw err;
            console.log('Fichier cree !');
        }
    );

    /* LECTURE DU FICHIER */

    fs.readFile(url, 'utf8', function (err, data) {
        if (err) throw err;
        console.log("Resultat du fichier : " + data);
    })


})

