const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("Hello World")
})

router.post('/signup',(req,res)=>{
   console.log(req.body.name)
})

module.exports = router