const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const redis_client = require('../redis_client')
const User = require('../schemas/UserSchema')


router.get('/',(req,res,next)=>{

    redis_client.get('user',async(err,user)=>{
        var user = JSON.parse(user)
        var payload = {
            pageTitle : user.username,
            userLoggedIn: user,
            profileUser:user
        }
        res.json(payload)
    })

})

router.get('/:username',async(req,res,next)=>{

    redis_client.get('user',async(err,user)=>{
        
        var payload = await getPayload(req.params.username,user)

        // console.log(payload,'------------------')
        res.statusCode = 200;
        res.json(payload)
    })

    
})

async function getPayload(username,userLoggedIn){
    var user = await User.findOne({username:username})

    if(user == null){
        user = await User.findById(username);
        if(user == null){
            return {
                pageTitle : 'User not found',
                userLoggedIn : JSON.parse(userLoggedIn),
                profileUser:user
            }
        }
    }

   
    return {
        pageTitle : user.username,
        userLoggedIn : JSON.parse(userLoggedIn),
        profileUser :user 
    }
}

module.exports = router
