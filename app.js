'use strict'

const algoliasearch = require('algoliasearch')
const Clarifai = require('clarifai')
const express = require('express')
const multer  = require('multer')
const bodyParser = require('body-parser')
const aws = require('./scripts/aws')
const clarifai = require('./scripts/clarifai-tagging')

const app = express()

const algolia = algoliasearch(process.env.algoliakey, process.env.algoliasecret)
const imageIndex = algolia.initIndex('ffreaction')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

//let clarifai = new Clarifai.App('{clientId}', '{clientSecret}')

const api = express.Router()

api.get('/images', (req, res) => {
  imageIndex.search(req.body.q, (err, content) => {
    if (err) {
      console.error(err)
    } else {
      res.json(content.hits)
    }
  })
})

api.get('/image/:id', (req, res) => {
  imageIndex.getObject(req.params.id, (err, content) => {
    res.json(content)
  })
})

api.put('/image/:id', (req, res) => {
  let updatedImage = {
    objectID: req.params.id
  }

  if(req.body.title) {
    updatedImage.title = req.body.title
  }

  if(req.body.tags) {
    updatedImage.tags = req.body.tags.split(',')
  }

  index.saveObjects([updatedImage], (err, content) => {
    res.json(content)
  })
})

api.delete('/image/:id', (req, res) => {
  imageIndex.deleteObjects([req.params.id], (err, content) => {
    res.json(content)
  })
})

api.post('/image', upload.single('imageData'), (req, res) => {
  aws.upload(req.file.buffer).then((url) => {
    console.log(url)
    clarifai.predictTags(url).then((clarifaiTags) => {
      imageIndex.addObjects([{
        title: req.body.title,
        tags: req.body.tags.split(','),
        predictions: clarifaiTags,
        path: url
      }], (err, content) => {
        if (err) {
          console.error(err)
        } else {
          res.json({id: content.objectIDs[0]})
        }
      })
    }).catch((err) => {
      console.log(err)
    })
    })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', api)

app.use(express.static('static'))

app.listen(process.env.PORT, () => {
  console.log('Listening')
})
