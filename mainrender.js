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

function getMessages() {
    window.electronAPI.getMessages().then((response) => {
        let data = response
        for (let i = data.length - 1; i >= 0; i--) {
            let el = data[i]
            addMessage(
                './recoursepack/offical/communication.png',
                '原批',
                el['content']
            )
        }
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
submitButtom.addEventListener('click', () => {
    let val = txtarea[0].value
    if (val == '') return

    window.electronAPI.sendMessage(md2html(val))
    txtarea[0].value = ''

    // getMessages()
})

addMessage(
    './recoursepack/offical/communication.png',
    '原批',
    '你说得对但是原神'
)
addMessage(
    './recoursepack/offical/communication.png',
    '原批',
    '是一款由米哈游自主研发的开放世界冒险游戏'
)
document.getElementsByTagName('form')[0].onsubmit = () => {}
window.onload = () => {
    setInterval(getMessages, 1000)
    getMessages()
    let getrs = window.electronAPI.getResource
    getrs('sidebar.backgroundcolor').then((data) => {
        // window.electronAPI.log(JSON.stringify(data))
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
