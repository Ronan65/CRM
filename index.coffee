express = require 'express'
http = require 'http'
https = require 'https'
path = require 'path'
CORS = require 'w3c-cors'
fs = require 'fs'

options =
  key: fs.readFileSync("ssl/server.key")
  ca: fs.readFileSync("ssl/server.csr")
  cert: fs.readFileSync("ssl/server.crt")

# Server Backend

app = express()

app.configure ->
	app.use express.bodyParser(
		keepExtensions: true
		uploadDir: __dirname + "/data"
	)
	app.use(express.logger('dev'))
	app.use(express.cookieParser())
	app.use(express.methodOverride())
	app.use(express.static(path.join('./page')))
	app.use(express.cookieSession({secret: process.env.COOKIE_SECRET || "Superdupersecret"}))
	app.use(express.methodOverride())
	app.use CORS ->
    	require __dirname + '/etc/CORS.json'

require('./routes/routes.js')(app)

app.listen 80


# Server client
client = express()

client.use(express.static(path.join('../client')))
client.use(express.logger('dev'))

client.all "/*", (req, res) ->
	console.log ("route")
	res.sendfile (path.resolve("../client/index.html"))

https.createServer(options, client).listen 1443
