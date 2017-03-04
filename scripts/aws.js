// Load the SDK for JavaScript
const conf = require('../config.js')
const AWS = require('aws-sdk')
const crypto = require('crypto')

AWS.config.loadFromPath(__dirname + '/../aws.json');

// Create S3 service object
var s3 = new AWS.S3( { params: {Bucket: 'hackupc'} });

function checksum (str) {
    return crypto
        .createHash('sha1')
        .update(str, 'utf8')
        .digest('hex')
}

module.exports = {
  //@Param file: Buffer
  upload: function(file){
    let data = {Key: checksum(file), Body: file};
    return new Promise( (resolve, reject)=>{
      s3.putObject(data, function(err, data){
        if (err) return reject(err)
        resolve('https://hackupc.s3.amazonaws.com/' + data.Key)
      });
    })

  }

}
