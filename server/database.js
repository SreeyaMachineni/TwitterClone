const mongoose = require('mongoose')
mongoose.set('useNewUrlParser',true)
mongoose.set('useUnifiedTopology',true)
mongoose.set('useFindAndModify', false);

class Database {
    constructor(){
        this.connect()
    }
    connect(){
        mongoose.connect('mongodb://127.0.0.1:27017/')
        .then(()=>{
            console.log('db connected')
        })
        .catch((err)=>{
            console.log('err connecting to db',err)
        })
    }
}

module.exports = new Database()