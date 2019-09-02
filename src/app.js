const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express() 
const port = process.env.PORT || 3000

// Define Paths for Express Config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs' )
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup Static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Witterung',
        name: 'Eshan Banerjee'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Eshan Banerjee'
    })
})
app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Call 911!!',
        title: 'Help',
        name: 'Eshan Banerjee'
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error :'You must provide an Address'
        })
    }
    geoCode(req.query.address,(error, {lat, long, place} = {}) => {
        if(error) {
          return res.send({error})
        }    
        forecast(lat, long, (error, {summary, temp, precip}) => {
          if(error) {
            return res.send({error})
          }
          res.send({
            address: req.query.address,
            location: place,
            forecast: summary + 'It is ' + temp + ' deg Outside. Today there is ' +precip + '% chance of precipitation.'
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404-page', {
        errorMessage: 'Help Article Not Found.',
        name: 'Eshan Banerjee',
        title: 'Error 404'
    })
})

app.get('*', (req, res) => {
    res.render('404-page', {
        errorMessage: 'Page Not Found.',
        name: 'Eshan Banerjee',
        title: 'Error 404'
    })
})

app.listen(port, () => {
    console.log('server up on port ' + port)
}) 