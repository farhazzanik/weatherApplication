const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(cors())


app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/history',require('./api/route'))

const PORT = process.env.PORT || 1111
app.listen(PORT, () => {
    console.log(`App is runnig by this ${PORT}`)
    mongoose.connect(`mongodb+srv://farhazzanik:imanik@mhcluster-wgda4.mongodb.net/weatherApi?retryWrites=true&w=majority`, { useNewUrlParser: true }, () => {
        console.log('Database Connected')
    })
})