const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../../schemas/UserSchema')
const redis_client = require('../../redis_client')

// app.use(bodyParser.urlencoded({extended:false}))


router.put('/:userId/follow',async(req,res,next)=>{
    var userId = req.params.userId;
    var user = await User.findById(userId)
    if(user == null){
        res.statusCode = 404;
        res.json()
    }
    redis_client.get('user',async(err,data)=>{
        var sessionUser = JSON.parse(data)
        var isFollowing = user.followers && user.followers.includes(sessionUser._id)
        var option = isFollowing ? '$pull' : '$addToSet';
        var newUser = await User.findByIdAndUpdate(sessionUser._id,{ [option] : {following : userId} },{new:true})
                        .catch((err)=>{
                            console.log(err,'-----------some iseu')
                            res.statusCode = 400;
                            res.json('err')
                        })

        redis_client.setex('user',3600,JSON.stringify(newUser))

        await User.findByIdAndUpdate(userId,{ [option] : {followers : sessionUser._id} })
                        .catch((err)=>{
                            console.log(err,'-----------some iseu')
                            console.log(err)
                            res.statusCode = 400;
                            res.json('err')
                        })
                       
        res.json(newUser)

    })

    // res.json()
})

module.exports = router