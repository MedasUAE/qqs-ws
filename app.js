var restify = require('restify');
var plugins = require('restify').plugins;
const corsMiddleware = require('restify-cors-middleware')

var mysql = require('mysql');

var config = require('./config/config');

// var redis = require('redis');
// //creates a new redis client at host 127.0.0.1 and port 6379
// var redisClient = redis.createClient(config.redis_port, config.redis_host);

// Database connection
db = mysql.createConnection(config.db);
db.connect((err)=>{
    if(err) {
        console.log("connection lost: ", err);
        // throw err;
    }
    console.log("DB '", config.db.database, "' Connected.");
});

// server started
var server = restify.createServer({
    name: 'qqsAPI',
    versions: ['1.0.0', '2.0.0']
});
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['API-Token-Expiry']
});


    server.use(plugins.bodyParser({ mapParams: false })); //for body data 
    server.use(restify.plugins.queryParser());//for query params 
    server.pre(cors.preflight)
    server.pre((req,res,next)=>{
        let pieces = req.url.replace(/^\/+/, '').split('/');
        let version = pieces[0];
        
        version = version.replace(/v(\d{1})\.(\d{1})\.(\d{1})/, '$1.$2.$3');
        version = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');
        version = version.replace(/v(\d{1})/, '$1.0.0');

        if (server.versions.indexOf(version) > -1) {
            req.url = req.url.replace(pieces[0] + '/', '');
            req.headers = req.headers || [];
            req.headers['accept-version'] = version;
        }
        else if(server.versions.indexOf(version) == -1)
            return res.send(400, {DisplayMessage:"VERSION NOT SUPPORT"});
    
        return next();
       
        // const version = req.headers['accept-version'];
        // if(!version)
       
        //     req.headers['accept-version'] = '1.0.0';
        // else if(server.versions.indexOf(version) == -1)
        //     return res.json(400, {error: "version not supported"})
        // return next(null)

    });
    server.use(cors.actual);

// server.use(plugins.authorizationParser()); //basic autherization
// server.use(auth.isAuthenticate);

server.listen(config.port,()=>{    
    require('./routes')(server);
    console.log(" qqs Server started on port: ", config.port);
});

// redisClient.on('connect', function () {
//     console.log('connected to redis server on port : ',config.redis_port);
// });
//exports.redisClient = redisClient;