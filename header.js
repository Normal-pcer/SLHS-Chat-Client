var config = undefined

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

module.exports = getSingleResource
