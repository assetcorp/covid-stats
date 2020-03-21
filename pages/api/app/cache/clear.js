/* eslint-disable indent */
import { clear } from '../../../../server/controllers/cache'
import { setDefaultResponse } from '../../../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		case 'POST':
			return clear( req, res )
		default:
			return setDefaultResponse( res )
	}
}
