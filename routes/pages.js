const express = require("express");
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.send('Pages List')
});

router.get('/page1', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/pages/page1.html'))
    console.log("{traceId:page1}")
});

module.exports = router;