const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (txt) => ipcRenderer.send('log', txt),
    getResource: (key) => ipcRenderer.invoke('get-resource', key),
    getMessages: () => ipcRenderer.invoke('get-messages'),
    sendMessage: (content) => ipcRenderer.invoke('send-message', content)
})
