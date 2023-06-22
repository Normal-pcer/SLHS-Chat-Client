const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (txt) => ipcRenderer.send('log', txt),
    getResource: (key) => ipcRenderer.invoke('get-resource', key),
    getMessages: () => ipcRenderer.invoke('get-messages'),
    sendMessage: (args) => ipcRenderer.invoke('send-message', args),
    getUserInfo: (uid) => ipcRenderer.invoke('get-user-info', uid),
    getChatInfo: (args) => ipcRenderer.invoke('get-chat-info', args),
    resetMessageBox: () => ipcRenderer.send('msg-box-rst'),
})
