// Import Dependencies
import url from 'url'
import { MongoClient } from 'mongodb'

// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
const connectToDatabase = async ( uri, dbName ) => {
	try {
		// If the database connection is cached,
		// use it instead of creating a new connection
		if ( cachedDb ) return cachedDb

		// If no connection is cached, create a new one
		const client = await MongoClient.connect( uri, { useNewUrlParser: true } )

		// Select the database through the connection,
		// using the database path of the connection string
		const db = await client.db( dbName === null ? url.parse( uri ).pathname.substr( 1 ) : dbName )

		// Cache the database connection and return the connection
		cachedDb = db
		return db
	} catch ( error ) {
		// console.log( error )
	}
}

export const getDatabase = async ( dbName = null ) => await connectToDatabase( process.env.MONGODB_URI, dbName )
