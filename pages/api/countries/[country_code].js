/* eslint-disable indent */
import { countryData } from '../../../server/controllers/app'
import { setDefaultResponse } from '../../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		case 'GET':
			return countryData( req, res )
		default:
			return setDefaultResponse( res )
	}
}
