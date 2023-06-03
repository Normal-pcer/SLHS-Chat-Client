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
    newElement.innerHTML = content;
    contentMain.appendChild(newElement)
})
