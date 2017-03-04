'use strict'

const config = require('./config')
const mongoose = require('mongoose')
const algoliasearch = require('algoliasearch')
const Clarifai = require('clarifai')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost/ffreaction')
const Image = mongoose.model('Image', {
  title: String,
  tags: [String],
  data: Buffer
})

const algolia = algoliasearch(config.algolia.key, config.algolia.secret)
const imageIndex = algolia.initIndex('ffreaction')

//let clarifai = new Clarifai.App('{clientId}', '{clientSecret}')

const api = express.Router()

api.get('/images', (req, res) => {
  res.send('Search the images')
})

api.get('/image/:id', (req, res) => {
  res.send('Just image ' + req.params.id)
})

api.put('/image/:id', (req, res) => {
  res.send('Update image ' + req.params.id)
})

api.delete('/image/:id', (req, res) => {
  res.send('Delete image  ' + req.params.id)
})

api.post('/image', (req, res) => {
  let newImage = {
    title: req.body.title,
    tags: req.body.tags.split(','),
    data: req.body.imageData
  }

  let image = new Image(newImage)
  image.save((err) => {
    if (err) {
      console.error(err)
    } else {
      index.addObjects([{
        title: image.title,
        tags: image.tags,
        objectID: image._id
      }], (err, content) => {
        if (err) {
          console.error(err)
        } else {
          res.json({
            id: image._id
          })
        }
      })
    }
  })
})

app.use('/api', api)

app.listen(8000, () => {
  console.log('Listening')
})
