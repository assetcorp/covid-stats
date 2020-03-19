/* eslint-disable indent */
import { setDefaultResponse } from '../../server/utils'

export default ( req, res ) => {
	const method = req.method

	switch ( method ) {
		default:
			return setDefaultResponse( res )
	}
}
