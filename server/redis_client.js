const redis = require('redis')
const redis_port = 6379
const client = redis.createClient(redis_port)
module.exports = client