import { buildResponse, genericErrorMessage, configureCache, CacheGroups } from '../utils'
import apiCache from 'apicache'
import { getCountryData } from '../utils/dataManager'

const cache = apiCache.middleware

export const all = async ( req, res ) => {
	// Configure API CACHE
	configureCache()

	cache( '1 day', () => res.statusCode === 200 )( req, res, async () => {
		try {
			req.apicacheGroup = CacheGroups.ALL

			const countryData = await getCountryData()

			if ( !countryData ) throw countryData

			return res.status( 200 ).send( buildResponse( false, 200, '', countryData ) )
		} catch ( error ) {
			// console.log( error )
			let message = 'Bad request'
			let status = 400

			if ( error ) { // Ambiguous. Not wrong though. Should change in the future.
				message = genericErrorMessage
				status = 500
			}

			return res.status( status ).send( buildResponse( true, status, message ) )
		}
	} )
}