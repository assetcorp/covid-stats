import fetch from 'isomorphic-unfetch'
import { SERVER_VARIABLES, CacheGroups } from '.'
import apiCache from 'apicache'

// Getting country data from https://coronavirus-19-api.herokuapp.com/countries
export const getCountryData = async () => {
	try {
		const request = await fetch( SERVER_VARIABLES.COVID_COUNTRY_URL )

		if ( request.status !== 200 ) throw request

		apiCache.clear( CacheGroups.COUNTRIES )
		return await request.json()
	} catch ( error ) {
		return null
	}
}

// Getting tracking information from https://coronavirus-tracker-api.herokuapp.com/all
export const getTrackerData = async () => {
	try {
		const request = await fetch( SERVER_VARIABLES.COVID_TRACKER_URL )

		if ( request.status !== 200 ) throw request

		apiCache.clear( CacheGroups.ALL )
		return await request.json()
	} catch ( error ) {
		return null
	}
}
