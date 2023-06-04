var config = undefined

function getConfig() {
    if (config !== undefined) return config
    let filename = './config.json'
    let fs = require('fs')
    let fileData = fs.readFileSync(filename).toString()
    let obj = JSON.parse(fileData)
    config = obj
    return obj
}

function getResources() {
    let fs = require('fs')

    let indexname = './recoursepack/index.json'
    let indexdata = JSON.parse(fs.readFileSync(indexname).toString())

    let filename =
        './recoursepack/' +
        indexdata[getConfig()['resource']['usedResourcePack']] +
        '/index.json'
    let fileData = fs.readFileSync(filename)

    return JSON.parse(fileData.toString())
}

function getSingleResource(key) {
    let fs = require('fs')
    let path = require('path')

    let indexname = './recoursepack/index.json'
    let indexdata = JSON.parse(fs.readFileSync(indexname).toString())

    let prev =
        './recoursepack/' +
        indexdata[getConfig()['resource']['usedResourcePack']]
    let tmp = getResources()[key]

    let content = ''
    if (tmp[0] != '/') content = tmp
    else content = path.join(__dirname, path.join(prev, tmp))
    return content
}

module.exports = getSingleResource
