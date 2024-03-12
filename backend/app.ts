const path = require( "path" );	// pathing shipped with nodeJS. construct path thats safe to run on any OS
const expresss = require( 'express' );
const bodyParser = require( 'body-parser' );
// const mongoose = require('mongoose');	
// const cors = require('cors');

const pokerRoutes = require( "./routes/poker" );
const app = expresss();

console.log( "backend starts!" );

// mongoose.connect("mongodb+srv://daza:" + process.env.MONGO_ATLAS_PW + "@cluster0.dzhrvu7.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true })
// 	.then( () => {
// 		console.log("Connected to database!");
// 	})
// 	.catch( () => {
// 		console.log("Connection to database failed.");
// 	});

app.use( ignoreFavicon );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) ); // supports only default features in the url encoding
// app.use("/images", expresss.static(path.join("backend/images")));	// any requests to this folder will be allowed to continue and fetch their files from here. requests to images forwared to backend/images
app.use( "/", expresss.static( path.join( __dirname, "angular" ) ) );

app.use( ( req: any, res: any, next: any ) => {
	res.setHeader( 'Access-Control-Allow-Origin', '*' );		// sets which domains are allowed to access our resources. here, app may sent request to all domains and they can access our resources
	res.setHeader( 'Access-control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin, Authorization' );	// sets what headers the domain can request along with default headers. request may have these extra headers
	res.setHeader( 'Access-control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS" );	//Allows which http requests may be sent. OPTIONS checks if post request is valid.
	res.setHeader( 'Access-Control-Allow-Credentials', true );
	// if (req.method === 'OPTIONS') {
	//   res.status(200).end()
	//   return
	// }
	// return await fn(req, res);
	next();
} )

// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true,            //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// }));


function ignoreFavicon( req: any, res: any, next: any ) {  // browser will try to make a second request to find a favicon.ico, executing middleware twice. this function to is ignore that 2nd request
	if ( req.originalUrl === '/favicon.ico' ) {	// check https://stackoverflow.com/questions/35408729/expresss-js-prevent-get-favicon-ico/35408810#35408810
		res.status( 204 ).json( { nope: true } );		// note response code 204 returns no body
	} else {
		next();
	}
}

app.use( "/api/poker", pokerRoutes );

app.use( ( req: any, res: any, next: any ) => {
	res.sendFile( path.join( __dirname, "angular", "index.html" ) );
} )

module.exports = app;