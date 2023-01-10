const path = require('path')
const express = require('express')
const httpsRedirect = require('express-https-redirect')
const axios = require('axios');

const app = express()

if (process.env.HTTPS_REDIRECT) {
    app.use('/', httpsRedirect())
}

app.use(express.static(path.join(__dirname, 'dist')))
app.set('port', process.env.PORT || 8080)
app.get('/bound_email/:verify_code', function(req, res) {
    const verifyCode = req.params['verify_code']
    if (verifyCode === undefined || verifyCode === null || verifyCode.length === 0) {
        res.redirect('/fail.html');
        return;
    }
    const request = {
        key: verifyCode,
    }
    axios.post(process.env.API_VERIFY_URL, request)
        .then(response => {
            if (response.status === 200) {
                res.redirect('/verify.html')
            } else {
                console.error('Could not verify code')
                console.error('> code = ', verifyCode)
                console.error('> response = ', response.status, response.statusText)
                console.error('> data = ', response.data)
                res.redirect('/fail.html');
            }
        }).catch(error => {
            console.error('Could not verify code')
            console.error('> code = ', verifyCode)
            console.error('> error = ', error.message)
            console.error('> data = ', error.response?.data)
            res.redirect('/fail.html');
        })
})
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
