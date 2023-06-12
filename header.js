var config = undefined
var lastMessageId = -1

function getConfig() {
    if (config !== undefined) return config
    let path = require('path')
    let filename = path.join(__dirname, './config.json')
    let fs = require('fs')
    let fileData = fs.readFileSync(filename).toString()
    let obj = JSON.parse(fileData)
    config = obj
    return obj
}

async function getMessages() {
    let server = getConfig()['server']
    let axios = require('axios')
    let data = new FormData()
    let rt = undefined

    data.append('user_id', 2)
    data.append('token', '06ee41b96f4933c6ddd32e222817730d')
    data.append('last', lastMessageId)
    data.append('chat_id', -1)

    await axios
        .post(server + '/get_messages.php', data)
        .then((rsp) => {
            rt = rsp.data['data']
            console.log(rt)
            if (rt.length >= 1) {
                let maxid = -1
                rt.forEach((element) => {
                    if (element['msg_id'] > maxid) maxid = element['msg_id']
                })
                lastMessageId = maxid
            }
        })
        .catch((err) => {
            console.log(err)
        })

    return rt
}

function sendMessage(content) {
    let server = getConfig()['server']
    let axios = require('axios')
    let data = new FormData()
    data.append('user_id', 2)
    data.append('token', '06ee41b96f4933c6ddd32e222817730d')
    data.append('chat_id', 1)
    data.append('content', content)

    axios
        .post(server + '/send_message.php', data)
        .then((dat) => {
            console.log(dat)
        })
        .catch((err) => {
            console.log(err)
        })
    return undefined
}

function getResources() {
    let fs = require('fs')
    let path = require('path')

    let indexname = path.join(__dirname, './recoursepack/index.json')
    let indexdata = JSON.parse(fs.readFileSync(indexname).toString())

    let filename =
        './recoursepack/' +
        indexdata[getConfig()['resource']['usedResourcePack']] +
        '/index.json'
    let fileData = fs.readFileSync(path.join(__dirname, filename))

    return JSON.parse(fileData.toString())
}

function getSingleResource(key) {
    let fs = require('fs')
    let path = require('path')

    let indexname = path.join(__dirname, './recoursepack/index.json')
    let indexdata = JSON.parse(fs.readFileSync(indexname).toString())

    let pathprev = path.join(
        __dirname,
        'recoursepack/' + indexdata[getConfig()['resource']['usedResourcePack']]
    )
    let tmp = String(getResources()[key])

    let content = ''
    let type = ''

    let splitPos = tmp.indexOf(':')
    let before = tmp.substring(0, splitPos)
    let after = tmp.substring(splitPos + 1)

    type = before
    if (before == 'path') {
        content = after
        content = content.replace('%packdir%', pathprev)
    } else {
        content = after
    }

    return [type, content]
}

module.exports = {
    getSingleResource,
    getMessages,
    sendMessage,
}
