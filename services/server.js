const express = require('express');
const path = require('path');
const app = express()
const port = 3001
app.use(express.static(path.join(__dirname, '../src')));
app.get('/', (req, res) => {
    console.log("{traceId:homepage}")
    res.redirect('/home')
})

app.get('/home', (req, res) => {
    console.log("{traceId:homepage}")
    res.sendFile(path.join(__dirname, '../src/index.html'));
})

const pageRouter = require('../routes/pages')
app.use('/pages', pageRouter)

app.listen(port, () => {
    console.log(`Express tutorial app listening at http://localhost:${port}`)
})