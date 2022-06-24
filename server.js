const path = require('path')
const express = require('express')
const httpsRedirect = require('express-https-redirect')

const app = express()
app.use('/', httpsRedirect())
app.use(express.static(path.join(__dirname, 'dist')))
app.set('port', process.env.PORT || 8080)
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/dist/index.html'), function (err) {
        if (err) {
            res.status(500).send(__dirname)
        }
    })
})
const server = app.listen(app.get('port'), function () {
    console.log('listening on port ', server.address().port)
})
