import { config } from 'dotenv'
import apiCache from 'apicache'

// Configure environment variables
config()

// A function to generate a random string
export const genRandomString = ( length = 10 ) => {
	let text = ''
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charLen = parseInt( length )

	for ( var i = 0; i < charLen; i++ )
		text += possible.charAt( Math.floor( Math.random() * possible.length ) )

	return text.toUpperCase()
}

// Utility function to send response to the client
export const buildResponse = ( error = true, status = 404, message = 'Not found', response = null ) => {

	return {
		error,
		status,
		message,
		response,
	}
}

export const genericErrorMessage = 'Something went wrong. We are working to fix it'

export const buildErrorResponse = ( code = 500, message = genericErrorMessage ) =>
	buildResponse( true, code, message, null )

export const setDefaultResponse = ( res, code = 405, message = 'We cannot process this request' ) =>
	res.status( code ).json( buildErrorResponse( code, message ) )


export const validateRequest = ( req, res, fields = [], reqType = 'body', errorCode = 400 ) => {
	try {
		const reqParams = Object.keys( req[reqType] )
		let pass = true
		let message = 'Some required fields are missing'

		for ( let item of fields ) {
			if ( reqParams.indexOf( item ) === -1 ) {
				pass = false
				message = `The '${item}' field is required`
				break
			} else if ( req[reqType][item].length === 0 ) {
				pass = false
				message = `The '${item}' field cannot be empty`
				break
			}
		}

		if ( !pass )
			return res.status( errorCode ).json( buildErrorResponse( errorCode, message ) )

		return true
	} catch ( error ) {
		// console.log( error )
		return res.status( 500 ).json( buildErrorResponse( 500 ) )
	}
}

export const validateToken = ( req, res ) => {
	try {
		if ( !req.body.token ) throw new Error( 'Error' )

		if ( req.body.token !== CONFIG_VARIABLES.CRON_TOKEN )
			return res.status( 403 ).send( buildErrorResponse( 401, 'You do not have permission to access the requested resource' ) )
		else return true
	} catch ( error ) {
		// console.log( error )
		return res.status( 401 ).send( buildErrorResponse( 401, 'You are not authenticated' ) )
	}
}

export const SERVER_VARIABLES = {
	COVID_COUNTRY_URL: 'https://coronavirus-19-api.herokuapp.com/countries',
	COVID_TRACKER_URL: 'https://coronavirus-tracker-api.herokuapp.com/all',
}

export const CONFIG_VARIABLES = {
	CRON_TOKEN: process.env.CRON_TOKEN,
	DB_NAME: process.env.DB_NAME,
	DB_COLLECTION_COUNTRIES: process.env.DB_COLLECTION_COUNTRIES,
	DB_COLLECTION_LATEST: process.env.DB_COLLECTION_LATEST,
	DB_COLLECTION_CONFIRMED: process.env.DB_COLLECTION_CONFIRMED,
	DB_COLLECTION_RECOVERED: process.env.DB_COLLECTION_RECOVERED,
	DB_COLLECTION_DEATHS: process.env.DB_COLLECTION_DEATHS,
}

// Configure API cache
export const configureCache = () => {
	try {
		apiCache.options( {
			statusCodes: [200],
		} ).middleware
	} catch ( error ) {
		return false
	}
}

export const CacheGroups = {
	ALL: 'all',
	COUNTRIES: 'countries',
}