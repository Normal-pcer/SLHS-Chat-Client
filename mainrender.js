const submitButtom = document.getElementById('submit')
const txtarea = document.getElementsByTagName('textarea')
submitButtom.addEventListener('click', () => {
    let val = txtarea[0].value
    let converter = new showdown.Converter()
    let content = filterXSS(converter.makeHtml(val))
    window.electronAPI.log(content)
    txtarea[0].value = ''

    let contentMain = document.getElementById('content-main')
    let newElement = document.createElement('div')
    newElement.innerHTML = content
    contentMain.appendChild(newElement)
})
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
