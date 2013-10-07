module.exports = (config) ->
    config ?= {}
    config = config?() or config
    (req, res, next) ->
        for key, value of config
            res.header key, value
        next()