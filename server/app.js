const express = require('express')
const app = express()
const middleware = require('./middleware')
const port = 3001
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('./database')
const session = require('express-session')



const server = app.listen(port,()=>{
    console.log('listening')
})

// app.use(session({
//     secret: "our-passport-local-strategy-app",
//     resave: true,
//     saveUninitialized: false,
// }));  
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cors({origin:'*'}))




//routes
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')
const logoutRoute = require('./routes/logouts')
const profileRoutes = require('./routes/profileRoutes')
const userRoutes = require('./routes/api/users')

//api routes
const postApiRoute = require('./routes/api/posts')


app.use('/login',loginRoute)
app.use('/register',registerRoute)
app.use('/logout',logoutRoute)
app.use('/api/posts',postApiRoute)
app.use('/profile',profileRoutes)
app.use('/api/users',userRoutes)

app.get('/',middleware.requireLogin,(req,res,next)=>{
    res.status(200).send('yess')
})