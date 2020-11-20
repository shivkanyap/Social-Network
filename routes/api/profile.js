const express=require('express')
const router=express.Router();
const mongoose=require('mongoose')
const passport=require('passport')

//Load Validation
const validateProfileInput=require('../../validation/profile')

const validateExperienceInput=require('../../validation/experience')
const validateEducationInput=require('../../validation/education')

const Profile=require('../../app/Models/Profile')
const User=require('../../app/Models/User');
const profile = require('../../validation/profile');

router.get('/test',(req,res)=>res.json({msg:"Profile Works"}))


//@routes GET api/profile
//@desc GEt current users profile
//@access Private
router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const errors={}

    Profile.findOne({user:req.user.id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile="There is no profile of this user"
            return res.status(404).json(errors)
        }       
        res.json(profile)

    })
    .catch(err=>res.status(400).json(err))
})


//@routes GET api/profile/all
//@desc get all profile
//@access Public
router.get('/all',(req,res)=>{
    const errors={}
    Profile.find()
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile="There is no profile for this user"
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err=>res.status(404).json({profile:"There is no profile for this user"}))
})



//@routes GET api/profile/handle/:handle
//@desc get profile by handle
//@access Public
router.get('/handle/:handle',(req,res)=>{
    const errors={}
    Profile.findOne({handle:req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile="There is no profile for this user"
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err=>res.status(404).json(err))
})



//@routes GET api/profile/user/:user_id
//@desc get profile by user id
//@access Public
router.get('/user/:user_id',(req,res)=>{
    const errors={}
    Profile.findOne({user:req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile=>{
        if(!profile){
            errors.noprofile="There is no profile for this user"
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err=>res.status(404).json({profile:"There is no profile for this user"}))
})


//@routes POST api/profile
//@desc Create users profile
//@access Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {errors,isValid}=validateProfileInput(req.body)

    //Check Validation
    if(!isValid){ 
        //return any errors with 400 status
        return res.status(400).json(errors)
    }
    //Get fields
    const profileFields={};
    profileFields.user=req.user.id;
    if(req.body.handle) profileFields.handle=req.body.handle
    if(req.body.company) profileFields.company=req.body.company
    if(req.body.website) profileFields.website=req.body.website
    if(req.body.status) profileFields.status=req.body.status
    if(req.body.bio) profileFields.bio=req.body.bio
    if(req.body.location) profileFields.location=req.body.location
    if(req.body.githubusername) profileFields.githubusername=req.body.githubusername
    //Skills -Splits into array
    if(typeof req.body.skills!==undefined){
        profileFields.skills=req.body.skills.split(',')
    }

    //Social
    profileFields.social={}
    if(req.body.youtube) profileFields.social.youtube=req.body.youtube
    if(req.body.instagram) profileFields.social.instagram=req.body.instagram
    if(req.body.facebook) profileFields.social.facebook=req.body.facebook
    if(req.body.linkedin) profileFields.social.linkedin=req.body.linkedin
    if(req.body.twitter) profileFields.social.twitter=req.body.twitter

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile){
            //update
            Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set :profileFields},
                {new:true}
            )
            .then(profile=>res.json(profile))

        }else{
            //create

            //check if handle exists
            Profile.findOne({handle:profileFields.handle}).then(profile=>{
                if(profile){
                    errors.handle="That handle already exists"
                    res.status(404).json(errors)
                }
                //save Profile
                new Profile(profileFields).save().then(profile=>res.json(profile))
            })
        }
    })

})

//@routes POST api/profile/experience
//@desc Add experience to profile
//@access Private
router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {errors,isValid}=validateExperienceInput(req.body)

    //Check Validation
    if(!isValid){ 
        //return any errors with 400 status
        return res.status(400).json(errors)
    }

    //Ge
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        const newExp={
            title:req.body.title,
            company:req.body.company,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            location:req.body.location,
            description:req.body.description

        }

        //Add experience array
        profile.experience.unshift(newExp);
        profile.save().then(profile=>res.json(profile))
    })
})

//@routes POST api/profile/education
//@desc Add education to profile
//@access Private
router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {errors,isValid}=validateEducationInput(req.body)

    //Check Validation
    if(!isValid){ 
        //return any errors with 400 status
        return res.status(400).json(errors)
    }

    //Ge
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        const newEdu={
            school:req.body.school,
            degree:req.body.degree,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            fieldofstudy:req.body.fieldofstudy,
            description:req.body.description

        }

        //Add experience array
        profile.education.unshift(newEdu);
        profile.save().then(profile=>res.json(profile))
    })
})


//@routes DELETE api/profile/experience/:EXP_ID
//@desc Delete experience from profile
//@access Private
router.delete('/experience/:exp_id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        
       //get remove index
       const removeIndex=profile.experience
       .map(item=>item.id)
       .indexOf(req.params.exp_id)

       //Splice out a array
       profile.experience.splice(removeIndex,1)
       //Save
       profile.save().then(profile=>res.json(profile))
    })
    .catch(err=>res.status(404).json(err))
})


//@routes DELETE api/profile/education/:Edu_id
//@desc Delete education from profile
//@access Private
router.delete('/education/:edu_id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        
       //get remove index
       const removeIndex=profile.education
       .map(item=>item.id)
       .indexOf(req.params.edu_id)

       //Splice out a array
       profile.education.splice(removeIndex,1)
       //Save
       profile.save().then(profile=>res.json(profile))
    })
    .catch(err=>res.status(404).json(err))
})




//@routes DELETE api/profile
//@desc Delete  profile
//@access Private
router.delete(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id }).then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      });
    }
  );
  
// router.delete('/',
// passport.authenticate('jwt',{session:false}),(req,res)=>{

//     Profile.findOneAndRemove({user:req.user.id})
//     .then(()=>{
//         User.findOneAndRemove({ _id: req.user.id })
//         .then(()=>res.json({success:true}) )
//     })
//     .catch(err=>res.status(404).json(err))
// })

module.exports=router