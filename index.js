const zlib = require('zlib')
const fs = require('fs')

const gzip = zlib.createGzip()

const readStream = fs.createReadStream('./package.json')
const writeStream = fs.createWriteStream('./package.json.gz')

readStream.pipe(gzip).pipe(writeStream)

console.log(fs.statSync('./package.json'))