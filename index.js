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

    ipcMain.handle('create-chat', (e, n) => {
        return header.createChat(n)
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

    ipcMain.on('log', (event, msg) => {
        console.log(msg)
    })

    ipcMain.handle('get-server', async (e) => {
        return header.getConfig()['server']
    })

    const login = async function (e, args) {
        u = args[0]
        p = args[1]
        s = args[2]
        let config = header.getConfig()
        if (config['server'] != s) {
            config['server'] = s
            header.setConfig(config)
        }
        let axios = require('axios')
        let data = new FormData()
        let sha256 = require('crypto-js/sha256')
        data.append('user_id', u)
        data.append('password', sha256(p))
        let rsp = undefined
        await axios
            .post(s + '/login.php', data)
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
    }

    ipcMain.handle('login', login)
    ipcMain.handle('sign-up', async (ev, args) => {
        u = args[0]
        p = args[1]
        e = args[2]
        s = args[3]
        let config = header.getConfig()
        if (config['server'] != s) {
            config['server'] = s
            header.setConfig(config)
        }
        let axios = require('axios')
        let data = new FormData()
        let sha256 = require('crypto-js/sha256')
        data.append('username', u)
        data.append('password', sha256(p))
        data.append('email', e)
        let rsp = undefined
        await axios
            .post(s + '/signup.php', data)
            .then((response) => {
                rsp = response['data']
                console.log(rsp)
                if (rsp['status'] == 'ok') {
                    login(undefined, [rsp['id'], p, s])
                }
            })
            .catch((err) => {
                console.log(err)
            })
        return rsp
    })

    loginWindow.loadFile(path.join(__dirname, 'login.html'))
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
