'use strict'

const config = require('./config')
const algoliasearch = require('algoliasearch')
const Clarifai = require('clarifai')
const express = require('express')
const multer  = require('multer')
const bodyParser = require('body-parser')

const app = express()

const algolia = algoliasearch(config.algolia.key, config.algolia.secret)
const imageIndex = algolia.initIndex('ffreaction')

const upload = multer({ dest: 'static/images' })

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
  index.deleteObjects([req.params.id], (err, content) => {
    res.json(content)
  })
})

api.post('/image', upload.single('imageData'), (req, res) => {
  console.log(req.file)
  imageIndex.addObjects([{
    title: req.body.title,
    tags: req.body.tags.split(','),
    path: req.file.path
  }], (err, content) => {
    if (err) {
      console.error(err)
    } else {
      res.json({id: content.objectIDs[0]})
    }
  })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', api)

app.use(express.static('static'))

app.listen(8080, () => {
  console.log('Listening')
})
