CORS
====
CORS configuration middleware.

# Installation

    npm install w3c-cors

# Usage

CORS middleware needs to be configured. You can configure it with an argument like this one :

    {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorisation, X-Requested-With"
    }
    
it can be loaded by passing an object or a function.

Because configuration options are plain W3C specification terms, you can get every attributes from [W3C CORS specification](http://www.w3.org/TR/cors/)

# examples

configuration throw object :

    CORS({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorisation, X-Requested-With"
    })
    
configuration throw a json file: 

    CORS(function() {
        return require(__dirname + '/config.json');
    })
    
a full example using [express](http://expressjs.com/) is available in the example directory.

# License

MIT License, see LICENSE