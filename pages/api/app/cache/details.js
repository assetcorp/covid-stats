/* eslint-disable indent */
import { getCacheDetails } from '../../../../server/controllers/cache'
import { setDefaultResponse } from '../../../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		case 'GET':
			return getCacheDetails( req, res )
		default:
			return setDefaultResponse( res )
	}
}
