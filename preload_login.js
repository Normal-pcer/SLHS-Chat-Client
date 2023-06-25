const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (txt) => ipcRenderer.send('log', txt),
    login: (args) => ipcRenderer.invoke('login', args),
    signup: (args) => ipcRenderer.invoke('sign-up', args),
})
