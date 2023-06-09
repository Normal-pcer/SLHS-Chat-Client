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

    let cm = document.getElementById('content-main')
    cm.insertBefore(element, cm.firstChild)
}

const submitButtom = document.getElementById('submit')
const txtarea = document.getElementsByTagName('textarea')
submitButtom.addEventListener('click', () => {
    let val = txtarea[0].value
    if (val == '') return
    let converter = new showdown.Converter()
    addMessage(
        './recoursepack/offical/communication.png',
        '原批',
        converter.makeHtml(val.replace(/\n/g, '\n\n'))
    )
    txtarea[0].value = ''

    let contentMain = document.getElementById('content-main')
    let newElement = document.createElement('div')
    newElement.innerHTML = content
    contentMain.appendChild(newElement)
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
