import { buildResponse, validateToken } from '../utils'
import apiCache from 'apicache'

export const clear = async ( req, res ) => {
	if ( validateToken( req, res ) ) {
		try {
			if ( 'key' in req.body ) {
				apiCache.clear( req.body.key )
			}
			apiCache.clear()
			return res.status( 200 ).send( buildResponse( false, 200, 'Cleared cache successfully', null ) )
		} catch ( error ) {
			console.log( error )

			let message = 'Failed to clear cache'
			let status = 500

			return res.status( status ).send( buildResponse( true, status, message ) )
		}
	}
}

export const getCacheDetails = async ( req, res ) => {
	if ( validateToken( req, res ) ) {
		try {
			const response = {
				duration: apiCache.getDuration(),
				index: apiCache.getIndex(),
				performance: apiCache.getPerformance(),
			}
			return res.status( 200 ).send( buildResponse( false, 200, 'Retrieved cache details', response ) )
		} catch ( error ) {
			let message = 'Failed to clear cache'
			let status = 500

			return res.status( status ).send( buildResponse( true, status, message ) )
		}
	}
}