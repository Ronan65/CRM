fs = require 'fs'
_ = require 'underscore'

module.exports = (filename, cb) ->
    fs.readFile filename, (err, data) ->
        cb err if err
        body = data.toString('binary').trim().split('\r')
        header = body.shift().split(';')
        result = []
        for row in body
            tmp = {}
            for value, i in row.split(';')
                tmp[header[i].replace RegExp(" ","g"), ""] = value.trim() if value isnt "" and value isnt " " and header[i] isnt "No MATERIEL" and header[i] isnt "Type de materiel (info)" and header[i] isnt "Marque"
            result.push tmp
        newArray = []
        _(result).each (element, index, array) ->
            hasDuplicate = (element, index, array) ->
                index += 1
                while index < array.length
                    return true  if _(element).isEqual(array[index])
                    index += 1
                false
            newArray.push element  unless hasDuplicate(element, index, array)
      
        cb null, newArray