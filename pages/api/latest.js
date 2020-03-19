/* eslint-disable indent */
import { latest } from '../../server/controllers/app'
import { setDefaultResponse } from '../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		case 'GET':
			return latest( req, res )
		default:
			return setDefaultResponse( res )
	}
}
