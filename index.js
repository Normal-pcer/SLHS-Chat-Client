const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const getSingleResource = require('./header')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: getSingleResource('window.icon'),
    })

    ipcMain.on('log', (event, msg) => {
        console.log(msg)
    })

    ipcMain.handle('get-resource', async function (event, key) {
        return getSingleResource(key)
    })

    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
