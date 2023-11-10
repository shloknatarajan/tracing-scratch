const port = 3001
const appServer = require('./server.js')
appServer.listen(port, () => {
    console.log(`Express tutorial app listening at http://localhost:${port}`)
})