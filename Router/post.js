const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const requirelogin = require("../Middleware/requirelogin");

//show all post
router.get("/allpost", requirelogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      return res.json({ post: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

// create post
router.post("/createpost", requirelogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Plase add all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// user posts
router.get("/mypost", requirelogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      return res.json({ post: mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});
//self post

// like Post
router.put("/like", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

//Unlike Post
router.put("/unlike", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

// Comment Post 
router.put("/comment", requirelogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  console.log(req.body.postId);
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// Delete Post
router.delete("/deletepost/:postId", requirelogin, (req,res) =>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                  res.json(result)
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})




module.exports = router;
