const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, "./recoursepack/offical/communication.png")
    })

    ipcMain.on('log', (event, msg) => {
        console.log(msg)
    })

    mainWindow.loadFile('index.html')
}

app.whenReady().then(
    () => {
        createWindow()
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    }

)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})