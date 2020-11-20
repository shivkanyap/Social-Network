const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const passport=require('passport')
const Post=require('../../app/Models/Posts')
const Profile=require('../../app/Models/Profile')

const validatePostInput =require('../../validation/posts')

//@route GET api/posts/test
router.get('/test',(req,res)=>res.json({msg:"Post Works"}))




// /route  GET api/posts
//@access public
router.get('/',(req,res)=>{
    Post.find()
    .sort({date:-1})
    .then(posts=>res.json(posts))
    .catch(err=>res.status(404).json({noposts:'No posts Found'}))
})


// /route  GET api/posts/:id
//@access public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
 
    .then(post=>res.json(post))
    .catch(err=>res.status(404).json({nopostfound:'No post found with this ID'}))
})



// /route  Post api/posts/
//@access private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid}=validatePostInput(req.body);
    //Check validation
    if(!isValid){
        //If any errors ,send 400 with errors
        return res.status(400).json(errors)
    }

    const newPost=new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });
    newPost.save().then(post=>res.json(post))
})


// /route  DELETE api/posts/:id
//@access PRIVATE

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            //check for post owner
            if(post.user.toString()!==req.user.id){
                return res.status(401).json({notauthorized:'User not authorized'})
            }

            //Delete
            post.remove().then(()=>res.json({success:true}))
        })
        .catch(err=>res.status(404).json({postnotfound:"No post found"}))
    }) 
})


// /route  POST api/posts/like/:id
//@access PRIVATE

router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                return res.status(400).json({alreadyLiked:'User already liked this post'})
            }
            //Add user id to likes array
            post.likes.unshift({user:req.user.id})

            post.save().then(post=>res.json(post))

          
        })
        .catch(err=>res.status(404).json({postnotfound:"No post found"}))
    })
})


// /route  POST api/posts/unlike/:id
//@access PRIVATE

router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        Post.findById(req.params.id)
        .then(post=>{
            if(post.likes.filter(like=>like.user.toString()===req.user.id)
            .length===0
            ){
                return res.status(400).json({notLiked:'You have not at liked this post'})
            }
            //Get remove index
           const removeIndex=post.likes
           .map(item=>item.user.toString())
           .indexOf(req.user.id);

           //splice out of array
           post.likes.splice(removeIndex,1);

           //save
           post.save().then(post=>res.json(post))
        })
        .catch(err=>res.status(404).json({postnotfound:"No post found"}))
    })
})


// /route  POST api/posts/comment/:id
//@access PRIVATE
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {errors,isValid}=validatePostInput(req.body);
    //Check validation
    if(!isValid){
        //If any errors ,send 400 with errors
        return res.status(400).json(errors)
    }
    Post.findById(req.params.id)
    .then(post=>{
        const newComment={
            text:req.body.text,
            name:req.body.name,
            avatar:req.body.avatar,
            user:req.body.user

        }
        //Add to coommentsarray
        post.comments.unshift(newComment)
        //Save
        post.save().then(post=>res.json(post))
    })
    .catch(err=>res.status(404).json({postnotfound:'Not post found'}))

})

// /route  DELETE api/posts/comment/:id/comment_id
//remove a comment 
//@access PRIVATE
router.post('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    
    Post.findById(req.params.id)
    .then(post=>{
        //Check if the comment exits
        if(post.comments.filter(comment=>comment._id.toString()===req.params.comment_id).length===0){
            return res.status(404).json({commentnotexists:'Comment does not exist'})
        }
        //Get remove index
        const removeIndex=post.comments
        .map(item=>item._id.toString())
        .indexOf(req.params.comment_id)

        //
    })
    .catch(err=>res.status(404).json({postnotfound:'Not post found'}))

})

module.exports=router