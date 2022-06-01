const express = require('express')
const router =  express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post");
const requirelogin = require('../Middleware/requirelogin')

//show all post
router.get("/allpost",(req,res)=>{
    Post.find().populate("postedBy","_id name").then(posts=>{
        return res.json({post:posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

// create post 
router.post('/createpost',requirelogin,(req,res)=>{
    const {title,body,pic} = req.body 
    if(!title || !body){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})
module.exports = router