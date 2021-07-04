const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const Post= require('../../schemas/PostSchema')
const User = require('../../schemas/UserSchema')
const redis_client = require('../../redis_client')



router.get('/',async(req,res,next)=>{
    var searchObj = req.query;

    if(searchObj.isReply !== undefined){
        var isReply = searchObj.isReply == 'true';
        searchObj.replyTo = {$exists:isReply}
        delete searchObj.isReply
    }
    var results = await getPosts(searchObj)
    res.json(results)
})

router.post('/',(req,res,next)=>{
    
    if(!req.body.post){
        res.statusCode = 400;
        res.json()
    }

    else{
        redis_client.get('user',(err,data)=>{
            const user = JSON.parse(data)
            var postData = {
                content:req.body.post,
                postBy:user
            }
            if(req.body.replyTo){
                postData.replyTo = req.body.replyTo
            }
            Post.create(postData).then(
                async(newPost)=>{
                    newPost = await User.populate(newPost,{path:'postBy'})
                    res.json(newPost)
                }
            )
        })
    }
    // res.statusCode = 200;
    // res.json()
    
})

router.put('/:id/like',async(req,res,next)=>{
    
    redis_client.get('user',async(err,user)=>{
        const postId = req.params.id
        var user = JSON.parse(user)
        const userId = user._id
        var isLiked = user.likes && user.likes.includes(postId)

        var option = isLiked ? "$pull" : "$addToSet"
        //insert user like
       var newUser = await User.findByIdAndUpdate(userId,{[option]:{likes:postId}},{new:true})
        .catch(error=>{
            console.log(error)
            res.statusCode = 400;
            res.json()
        })                    
       redis_client.setex('user',3600,JSON.stringify(newUser))


        //insert post like
        
        var newPost = await Post.findByIdAndUpdate(postId,{[option]:{likes:userId}},{new:true})
        .catch(error=>{
            console.log(error)
            res.statusCode = 400;
            res.json()
        })
    })
    res.json()
})

router.get('/:id',async(req,res,next)=>{
    const postId = req.params.id
    
    let postData = await getPosts({_id:postId})
    
    let result = {
        postData:postData
    }

    if(postData.replyTo !== undefined){
        result.replyTo = postData.replyTo
    }
    result.replies = await getPosts({replyTo:postId})
    // console.log(result)

    res.json(result)

})

router.delete('/:id',(req,res,next)=>{
    // console.log('here')
    Post.findByIdAndDelete(req.params.id).
    then(()=>{
        // console.log('here')
        res.statusCode = 202
        res.json()
    })
    .catch((err)=>console.log(err))
})

router.post('/:id/retweet',async(req,res,next)=>{
    redis_client.get('user',async(err,user)=>{
    const postId = req.params.id
    var user = JSON.parse(user)
    const userId = user._id

    //try and delete retweet
    
    var deletedPost= await Post.findOneAndDelete({postBy:userId,retweetData:postId})
    .catch(error=>{
        console.log(error)
        res.statusCode = 400;
        res.json()
    })

    var option = deletedPost != null ? "$pull" : "$addToSet"
    var repost = deletedPost;

    if(repost == null){
        repost = await Post.create({postBy:userId,retweetData:postId})
        .catch(error=>{
            console.log(error)
            res.statusCode = 400;
            res.json()
        })
    }
    var newUser = await User.findByIdAndUpdate(userId,{[option]:{retweets:repost._id}},{new:true})
    .catch(error=>{
        console.log(error)
        res.statusCode = 400;
        res.json()
    })
    redis_client.setex('user',3600,JSON.stringify(newUser))

    var newPost = await Post.findByIdAndUpdate(postId,{[option]:{retweetUsers:userId}},{new:true})
    .catch(error=>{
        console.log(error)
        res.statusCode = 400;
        res.json()
    })
    })
    res.json()

})

async function getPosts(filter){
    var results = await Post.find(filter)
    .populate('postBy')
    .populate('retweetData')
    .populate('replyTo')
    .sort({'createdAt':-1})
    .catch(
        (err)=>{
           console.log(err)
        }
    )

    // return await User.populate(results,{path:'retweetData.postBy'})
    results = await User.populate(results,{path:'replyTo.postBy'})

    return results;


    // .then((posts)=>{
    //     res.statusCode = 200
    //     res.json(posts)
    // })
    
}

module.exports = router