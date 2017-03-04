const aws = require('./aws')
const fs = require('fs')


fs.readFile(__dirname + '/maxresdefault.jpg', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  aws.upload(data);
});
