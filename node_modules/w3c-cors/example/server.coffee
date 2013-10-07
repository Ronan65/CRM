express = require 'express'
CORS = require 'w3c-cors'

server = express()
client = express()

###
server.use CORS ->
    require __dirname + '/config'
###

server.all '/', CORS(require __dirname + '/config'), (req, res) ->
    res.send 'Hello'

client.use express.static __dirname
    
server.listen 3000
client.listen 4000