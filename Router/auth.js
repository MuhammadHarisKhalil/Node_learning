const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys')
const requirelogin =require('../Middleware/requirelogin')

router.get("/protected", requirelogin,(req, res) => {
  res.send("Hello World");
});

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(422).json("Please Fill all the Fields");
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json("Already Registered");
    }
    bcrypt
      .hash(password, 12)
      .then((hashedpassword) => {
        const user = new User({
          email,
          name,
          password:hashedpassword,
        });

        user
          .save()
          .then((user) => {
            return res.json("Register Successfully");
          })
          .catch((err) => {
            console.log(err);
          });
      })
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return  res.status(422).json("Please Fill all the Fields");
   } else {
     User.findOne({email:email})
     .then(savedUser => {
       if(!savedUser){
         return res.status(422).json("Please Enter the valid email and password");
       }
       bcrypt.compare(password,savedUser.password)
       .then(doMatch=>{
        if(doMatch){
        //  return res.json("Login Successfully");
        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
        return res.json({token})
        }
        else {
         return res.status(422).json("Please Enter the valid email and password");
        }
       })
       .catch(err=>{
         console.log(err)
       })
     })
   }
});

// router.post("/signin", (res, req) => {
//   //const { email, password } = req.body;
//   return res.send("Login Successfully");
 
// });

module.exports = router;
