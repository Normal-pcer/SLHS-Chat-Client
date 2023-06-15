const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (txt) => ipcRenderer.send('log', txt),
    login: (user, pass) => ipcRenderer.invoke('login', user, pass)
})
