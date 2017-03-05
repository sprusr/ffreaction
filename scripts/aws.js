// Load the SDK for JavaScript
const AWS = require('aws-sdk')
const crypto = require('crypto')
const fileType = require('file-type');



// Create S3 service object
var s3 = new AWS.S3( { params: {Bucket: 'hackupc'} })

function checksum (str) {
    return crypto
        .createHash('sha1')
        .update(str, 'utf8')
        .digest('hex')
}

module.exports = {
  //@Param file: Buffer
  upload: function(file) {
    let data = {Key: checksum(file), Body: file}
    let ext = fileType(buffer);
    return new Promise((resolve, reject) => {
      s3.putObject(data, (err, result) => {
        if (err) return reject(err)
        resolve('https://hackupc.s3.amazonaws.com/' + data.Key + ext.ext)
      })
    })
  }
}
