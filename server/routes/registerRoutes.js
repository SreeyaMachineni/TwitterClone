const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const User = require('../schemas/UserSchema')
const bcrypt = require('bcrypt')

app.use(bodyParser.urlencoded({extended:false}))

router.post('/',(req,res,next)=>{
    var firstName = req.body.firstName?.trim()
    var lastName = req.body.lastName?.trim()
    var email = req.body.email?.trim()
    var username = req.body.username?.trim()
    var password = req.body?.password

    // const {firstName,lastName,email,username,password} = req.body

    var payload = req.body

    if(firstName && lastName && email && username && password){
        User.findOne({
            $or:[
                {username:username},
                {email:email}
            ]
        })
        .then((user)=>{
            console.log(user)
            if(user == null){
                var data = req.body
                bcrypt.hash(password,10).then(
                    (pwd)=>{
                        data.password = pwd;
                        User.create(data).then((user)=>{
                            res.json(payload)
                        })
                    }
                )
            }else{
                if(email == user.email){
                    payload.errorMessage = 'email already in use'
                }else{
                    payload.errorMessage = 'username already in use'
                }
                res.statusCode=403;
                res.json(payload)

            }
        })
        .catch((error)=>{
            console.log(error)
            payload = 'something went wrong'
            res.statusCode = 403;
            res.json(payload)

        })
    }
    else{
        payload.errorMessage = 'make sure every field has a valid value'
        // res.payload = payload
        res.statusCode=403;

        res.json(payload)
    }
})

module.exports = router
