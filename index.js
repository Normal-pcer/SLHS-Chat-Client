const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const header = require('./header')

const createWindowMain = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        icon: header.getSingleResource('window.icon'),
    })

    ipcMain.on('log', (event, msg) => {
        console.log(msg)
    })

    ipcMain.handle('get-resource', async function (event, key) {
        return header.getSingleResource(key)
    })

    ipcMain.handle('get-messages', async function (event) {
        // console.log(header.getMessages())

        return header.getMessages()
    })

    ipcMain.handle('send-message', async function (event, args) {
        return header.sendMessage(args[0], args[1])
    })

    ipcMain.handle('get-user-info', async function (event, args) {
        return header.getUserInfo(args)
    })

    ipcMain.handle('get-chat-info', async function (event, cid) {
        return header.getChatInfo(cid)
    })

    ipcMain.on('msg-box-rst', () => {
        header.resetMessageBox()
    })

    ipcMain.on('show-img', (e, s) => {
        let { shell } = require('electron')
        shell.openExternal(s)
    })

    mainWindow.loadFile('index.html')
}

const createWindowLogin = () => {
    const loginWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload_login.js'),
        },
        icon: header.getSingleResource('window.icon'),
    })

    ipcMain.handle('login', async function (e, u, p) {
        let axios = require('axios')
        let data = new FormData()
        let sha256 = require('crypto-js/sha256')
        data.append('user_id', u)
        data.append('password', sha256(p))
        let rsp = undefined
        await axios
            .post(header.getConfig()['server'] + '/login.php', data)
            .then((response) => {
                rsp = response['data']
                console.log(rsp)
                if (rsp['success']) {
                    header.setToken(u, rsp['token'])
                    createWindowMain()
                    loginWindow.destroy()
                }
            })
            .catch((err) => {
                console.log(err)
            })
        return rsp
    })

    loginWindow.loadFile('login.html')
}

app.whenReady().then(() => {
    createWindowLogin()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindowMain()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
