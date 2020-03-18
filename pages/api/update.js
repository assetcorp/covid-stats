/* eslint-disable indent */
import { updateData } from '../../server/controllers/app'
import { setDefaultResponse } from '../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		case 'POST':
			return updateData( req, res )
		default:
			return setDefaultResponse( res )
	}
}
