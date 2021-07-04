exports.requireLogin = (req,res,next) => {
    console.log('in middleware')
    if(req.session && req.session.user){
        return next()
    }else{
        return res.redirect('/login')   
    }
}