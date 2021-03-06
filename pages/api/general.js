/* eslint-disable indent */
import { all } from '../../server/controllers/app'
import { setDefaultResponse } from '../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		case 'GET':
			return all( req, res )
		default:
			return setDefaultResponse( res )
	}
}
