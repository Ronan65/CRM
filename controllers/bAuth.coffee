express = require 'express'
basicAuthMessage = 'Restrict area, please identify'

user = 'admin';
pass = '123';

module.exports = 
	basicAuth: express.basicAuth((username, password) ->
	  username is user and password is pass
	, basicAuthMessage)