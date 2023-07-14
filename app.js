const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json( {extended: true} ))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'prodution'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start() {
    try{

        //ожидание пока произойдет подключение (завершится промис)
        const mongoUri = config.get("mongoUri")
        console.log('Connect to mongoUri:', mongoUri)
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
            
        })

        app.listen(PORT, () => console.log(`app has been started on port ${PORT}...`))

         
    } catch (e) {
        console.log('Server error: ', e.message)
        process.exit(1) //выход из процесса  node js
    }

}

start()

