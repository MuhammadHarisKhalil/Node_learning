const express = require('express')
const router =  express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model("Post");
const requirelogin = require('../Middleware/requirelogin')

//show all post
router.get("/allpost",requirelogin,(req,res)=>{
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
    if(!title || !body || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get("/mypost",requirelogin,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate("postedBy","_id name").then(mypost=>{
        return res.json({post:mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})
//self post

router.put("/like",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/unlike",requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

module.exports = router