var thisChatId = 1
const consolelog = window.electronAPI.log

function addMessage(avatar, username, text) {
    let element = document.createElement('div')
    let avatarElement = document.createElement('img')
    let rightElement = document.createElement('div')
    let usernameElement = document.createElement('div')
    let textElement = document.createElement('div')

    avatarElement.src = avatar
    usernameElement.innerHTML = username
    textElement.innerHTML = filterXSS(text)
    usernameElement.className = 'msg-username'

    rightElement.appendChild(usernameElement)
    rightElement.appendChild(textElement)
    element.appendChild(avatarElement)
    element.appendChild(rightElement)
    element.className = 'markdown-body'

    let cm = document.getElementById('content-main')
    cm.insertBefore(element, cm.firstChild)
}

function clearMessages() {
    let cm = document.getElementById('content-main')
    cm.innerHTML = ''
}

async function getMessages() {
    window.electronAPI.getMessages().then(async (response) => {
        let data = response
        for (let i = data.length - 1; i >= 0; i--) {
            let el = data[i]
            if (el['from'] == thisChatId) {
                const this_message_content = el['content']
                await window.electronAPI
                    .getUserInfo([el['sender'], false])
                    .then(function (rsp) {
                        addMessage(
                            rsp['avatar'],
                            rsp['username'],
                            this_message_content
                        )
                    })
            }
        }
    })
}
function getChats() {
    window.electronAPI.getUserInfo([-1, true]).then((rsp) => {
        let chats = JSON.parse(rsp['chats'])
        chats.forEach((element) => {
            window.electronAPI.getChatInfo(element).then((info) => {
                let icon = info['icon']
                let title = info['name']

                let container = document.createElement('div')
                let iconEle = document.createElement('img')
                let titleEle = document.createElement('p')

                iconEle.src = icon
                titleEle.innerText = title
                iconEle.addEventListener('click', () => {
                    changechat(info['chat_id'])
                })
                container.appendChild(iconEle)
                container.appendChild(titleEle)

                document.getElementById('chat-list').appendChild(container)
            })
        })
    })
}
function sendmsg(content) {
    window.electronAPI.sendMessage([content, thisChatId])
}
function changechat(newch) {
    thisChatId = newch
    clearMessages()
    window.electronAPI.resetMessageBox()
    window.electronAPI.getChatInfo(newch).then((info) => {
        setChatIcon(info['icon'])
        setChatTitle(info['name'])
    })
}
const submitButtom = document.getElementById('submit')
const txtarea = document.getElementsByTagName('textarea')
const md2html = (mdtxt) => {
    let converter = new showdown.Converter()
    converter.setFlavor('github')

    let arr = String(mdtxt).split('```')
    let rst = ''
    for (let i = 0; i < arr.length; i += 2) {
        arr[i] = arr[i].replace(/\n/g, '\n\n')
    }
    for (let i = 0; i < arr.length; i++) {
        rst += arr[i] + (i == arr.length - 1 ? '' : '```')
    }
    return converter.makeHtml(rst)
}
const setChatTitle = (new_title) => {
    let titleElement = document.getElementById('chat-title')
    titleElement.innerText = new_title
}
const setChatIcon = (new_icon) => {
    let iconElement = document.getElementById('chat-icon')
    iconElement.src = new_icon
}

submitButtom.addEventListener('click', () => {
    let val = txtarea[0].value
    if (val == '') return

    sendmsg(md2html(val))
    txtarea[0].value = ''

    // getMessages()
})

document.getElementsByTagName('form')[0].onsubmit = () => {}
window.onload = () => {
    setInterval(getMessages, 1000)
    window.electronAPI.getChatInfo(thisChatId).then((rsp) => {
        setChatTitle(rsp['name'])
        setChatIcon(rsp['icon'])
    })
    getChats()
    let getrs = window.electronAPI.getResource
    getrs('sidebar.backgroundcolor').then((data) => {
        // consolelog(JSON.stringify(data))
        document.getElementById('sidebar').style.backgroundColor = data[1]
    })
    getrs('sidebar.top.mentions').then((data) => {
        if (data[0] == 'path')
            document.getElementById('side-top-no1').innerHTML =
                '<img src="' + data[1] + '" alt="mentions" />'
        else document.getElementById('side-top-no1').innerHTML = data[1]
    })
    getrs('sidebar.top.files').then((data) => {
        if (data[0] == 'path')
            document.getElementById('side-top-no2').innerHTML =
                '<img src="' + data[1] + '" alt="mentions" />'
        else document.getElementById('side-top-no2').innerHTML = data[1]
    })
    getrs('sidebar.top.favourites').then((data) => {
        if (data[0] == 'path')
            document.getElementById('side-top-no3').innerHTML =
                '<img src="' + data[1] + '" alt="mentions" />'
        else document.getElementById('side-top-no3').innerHTML = data[1]
    })
    getrs('sidebar.top.friends').then((data) => {
        if (data[0] == 'path')
            document.getElementById('side-top-no4').innerHTML =
                '<img src="' + data[1] + '" alt="mentions" />'
        else document.getElementById('side-top-no4').innerHTML = data[1]
    })
}
