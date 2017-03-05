var Clarifai = require('clarifai');

 // initialize with your clientId and clientSecret

 var app = new Clarifai.App(
   process.env.CLARIFAI_ID,
   process.env.CLARIFAI_SECRET
 );

module.exports = {
  predictTags: (url) => {
    return new Promise((resolve, reject) => {
    app.models.predict({ id: Clarifai.GENERAL_MODEL, language: 'en' }, url).then(
       function(response) {
         resolve(response.outputs[0].data.concepts.map(x => x.name))
       },
       function(err) {
         resolve(null)
       }
     )
   })
  }
}
