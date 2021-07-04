const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
const bcrypt = require('bcrypt')
const redis_client = require('../redis_client')

router.get('/',(req,res,next)=>{
    res.json({'logged':true})
})

router.post('/',(req,res,next)=>{
    if(req.body.username && req.body.password){
        User.findOne({username:req.body.username})
        .then(
            (user)=>{
                if(user){
                    bcrypt.compare(req.body.password,user.password)
                    .then((result)=>{
                        if(result === true){

//                             req.session.cookie.user  = user
//                             console.log(req.session,'----------------)))))))))))')
//                             req.session.cookie.expires = false;
                                // req.session.cookie.maxAge = 5 * 60 * 1000;
//                             req.session.save()

redis_client.setex('user',3600,JSON.stringify(user))
                            
                            res.json(user)
                            // res.end()
                        }
                    })

                }else{
                    res.statusCode=403
                    res.json({'errMsg':'error logging in'})
                }
            }
        )
        .catch(
            (err)=>{
                console.log(err)
                
                res.json({'errMsg':'error finding user'})
            }
        )

    }else{
        res.json({'errMsg':'Make sure each field has a value'})
    }
    
})

module.exports = router