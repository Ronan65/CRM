express = require 'express'
url = require 'url'
fs = require 'fs'
path = require 'path'
convert = require __dirname + '/csvToJson.coffee'
Datastore = require 'nedb'
db = new Datastore({ filename: 'data/datafile', autoload: true })
dbu = new Datastore({ filename: 'data/updatefile', autoload: true })

module.exports = 
	getForm: (req, res) ->
		res.sendfile(path.resolve('../server/page/form.html'))

	getStatPage: (req, res) ->
		res.sendfile(path.resolve('../server/page/stat.html'))

	getValidation: (req, res) ->
		res.sendfile(path.resolve('../server/page/validation.html'))

	getFile: (req, res) ->
		file = req.files.loadDB
		info = {}
		info.docUpdate = file.lastModifiedDate
		info.docSize = file.size
		fs.rename file.path, "data/dbUpload.csv"
		fs.unlinkSync("data/datafile")
		convert "data/dbUpload.csv", (err,result) ->
			info.docItems = result.length
			fs.writeFile 'data/update.json', JSON.stringify(info), (err) ->
				console.log err
			db = null
			db = new Datastore({ filename: 'data/datafile', autoload: true })
			db.insert item for item in result
			res.end()

	getList: (req, res) ->
		parts = url.parse req.url,true
		search = []
		for param of req.query
			insert = {}
			insert[param] = req.query[param]
			search.push insert
		db.find
			$and: search
			, (err, docs) ->
				res.json docs

	getDetailsId : (req, res) ->
		param = req.params.id
		results = []
		db.find
	    	_id: param
		, (err, docs) ->
			dbu.findOne
				"customer._id": param
			, (err, Udocs) ->
				if Udocs != null
					results.push Udocs.customer
					res.json (results) 
				else 
					res.json docs

	getStat: (req, res) ->
		path1 = require.resolve(__dirname + '../../../data/update.json')
		delete require.cache[path1]
		dataUpdate = require __dirname + '../../../data/update.json'
		console.log dataUpdate
		res.json dataUpdate

	updateCustomer: (req, res) ->
		param = req.params.id
		dbu.findOne
			"customer._id": param
		, (err, Udocs) ->
			console.log Udocs
			if Udocs != null
				dbu.remove
					"customer._id": param
				, { multi: true }
				, (err, numRemoved) ->
					if numRemoved > 0
						console.log "remove from update"
						insert = {}
						insert.customer = req.body
						insert.date = new Date
						insert.action = 'update'
						dbu.insert insert
			else 
				insert = {}
				insert.customer = req.body
				insert.date = new Date
				insert.action = 'update'
				dbu.insert insert
			console.log 'entree update customer'
			

	addCustomer : (req, res) ->
		console.log 'entree add customer'
		insert = {}
		insert.customer = req.body
		insert.date = new Date
		insert.action = 'add'
		dbu.insert insert

	deleteCustomer:  (req, res) ->
		db.find
			_id: req.params.id
		, (err, docs) ->
			insert = {}
			insert.customer = docs
			insert.date = new Date
			insert.action = 'delete'
			dbu.insert insert

	getListUpdate : (req, res) ->
		console.log "getListUpdate"
		dbu.find {}, (err, docs) ->
			res.json docs

	getCustomerDB : (req, res) ->
		console.log "DB"
		db.findOne
			_id: req.params.id
		, (err, docs) ->
			res.json docs

	getCustomerDBU : (req, res) ->
		console.log "DBU"
		dbu.findOne
				"customer._id": req.params.id
			, (err, Udocs) ->
				res.json Udocs

	confirmUpdate : (req, res) ->
		paramId = req.params.id
		customer = req.body.customer
		db.update
			_id: paramId
		, customer, {}, (err, numReplaced) ->
			db.update
				_id: req.params.id
			,
				$set:
					"lastUpdate.date": new Date()
					"lastUpdate.status": true
			, {}, (err, numReplaced) ->
				dbu.remove
						"customer._id": paramId
					, { multi: true }
					, (err, numRemoved) ->
						if numRemoved > 0
							res.send 200

	cancelUpdate : (req, res) ->
		console.log req.params.id
		paramId = req.params.id
		db.update
			_id: req.params.id
		,
			$set:
				"lastUpdate.date": new Date()
				"lastUpdate.status": false
		, {}, (err, numReplaced) ->
			dbu.remove
					"customer._id": paramId
				, { multi: true }
				, (err, numRemoved) ->
					if numRemoved > 0
						res.send 200

requireUncached = (module) ->
  delete require.cache[require.resolve(module)]
  require module

		
