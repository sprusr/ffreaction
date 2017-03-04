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
  //@Param file: base64data
  upload: function(file){
    let data = {Key: checksum(file), Body: file};
    s3.putObject(data, function(err, data){
      if (err)
        { console.log('Error uploading data: ', data);
        } else {
          console.log('succesfully uploaded the image!');
        }
    });

  }

}
