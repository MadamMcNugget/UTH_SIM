const appp = require( "./app" );		 		// this is how node.js import things
const debug = require( "debug" )( "node-angular" );
const http = require( "http" );

const normalizePort = ( val: any ) => {		// when setting up port, make sure its a valid number
	var port = parseInt( val, 10 );

	if ( isNaN( port ) ) {
		// named pipe
		return val;
	}

	if ( port >= 0 ) {
		// port number
		return port;
	}

	return false;
};

const onError = ( error: any ) => {		// when error occurs, output that error and exits server
	if ( error.syscall !== "listen" ) {
		throw error;
	}
	const bind = typeof port === "string" ? "pipe " + port : "port " + port;
	switch ( error.code ) {
		case "EACCES":
			console.error( bind + " requires elevated privileges" );
			process.exit( 1 );
			break;
		case "EADDRINUSE":
			console.error( bind + " is already in use" );
			process.exit( 1 );
			break;
		default:
			throw error;
	}
};

const onListening = () => {		// log that we are now listening to incoming requests
	const addr = server.address();
	const bind = typeof port === "string" ? "pipe " + port : "port " + port;
	debug( "Listening on " + bind );
};

const port = normalizePort( "3000" || "8081" );		// "3000" is string but since that value we receive is typically a string, use string here. may use number
appp.set( "port", port );

const server = http.createServer( appp );
server.on( "error", onError );
server.on( "listening", onListening );
server.listen( port );
