import { buildResponse, genericErrorMessage, configureCache, CacheGroups, validateToken, CONFIG_VARIABLES } from '../utils'
import apiCache from 'apicache'
import { getUpdatedData, getAllDataFromDB, getCountryDataFromDB, getLatestDataFromDB } from '../utils/dataManager'
import { getDatabase } from '../utils/db'

const cache = apiCache.middleware

export const all = async ( req, res ) => {
	// Configure API CACHE
	configureCache()

	cache( '1 day', () => res.statusCode === 200 )( req, res, async () => {
		try {
			req.apicacheGroup = CacheGroups.ALL

			const allData = await getAllDataFromDB()

			if ( !allData ) throw allData

			return res.status( 200 ).send( buildResponse( false, 200, '', allData ) )
		} catch ( error ) {
			// console.log( error )
			let message = genericErrorMessage
			let status = 500

			return res.status( status ).send( buildResponse( true, status, message ) )
		}
	} )
}

export const latest = async ( req, res ) => {
	// Configure API CACHE
	configureCache()

	cache( '1 day', () => res.statusCode === 200 )( req, res, async () => {
		try {
			req.apicacheGroup = CacheGroups.LATEST

			const latestData = await getLatestDataFromDB()

			if ( !latestData ) throw latestData

			return res.status( 200 ).send( buildResponse( false, 200, '', latestData ) )
		} catch ( error ) {
			// console.log( error )
			let message = genericErrorMessage
			let status = 500

			return res.status( status ).send( buildResponse( true, status, message ) )
		}
	} )
}

export const countryData = async ( req, res ) => {
	try {
		console.log( req.query )
		if ( 'country_code' in req.query ) {
			// Get data for specific country
			const countryData = await getCountryDataFromDB( req.query.country_code )

			if ( !countryData ) throw countryData

			return res.status( 200 ).send( buildResponse( false, 200, '', countryData[0] ) )
		}

		// Configure API CACHE
		configureCache()
		cache( '1 day', () => res.statusCode === 200 )( req, res, async () => {
			// Get all country data
			req.apicacheGroup = CacheGroups.COUNTRIES

			const countryData = await getCountryDataFromDB()

			if ( !countryData ) throw countryData

			return res.status( 200 ).send( buildResponse( false, 200, '', countryData ) )
		} )
	} catch ( error ) {
		console.log( error )
		let message = genericErrorMessage
		let status = 500

		if ( error === null )
			message = 'Sorry, we could not retrieve COVID-19 country data. Please try the general route to get all data.'

		return res.status( status ).send( buildResponse( true, status, message ) )
	}

}

export const updateData = async ( req, res ) => {
	if ( validateToken( req, res ) ) {
		try {
			// Get records
			const allRecords = await getUpdatedData()
			if ( !allRecords ) throw allRecords

			// Create database
			const db = await getDatabase( CONFIG_VARIABLES.DB_NAME )
			let result = {
				countries: null,
				latest: null,
				confirmed: null,
				recovered: null,
				deaths: null,
			}

			// Save country data
			if ( allRecords.dataByCountry ) {
				const collection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_COUNTRIES )
				const dbDelete = await collection.deleteMany( {} )

				if ( dbDelete ) {
					const dbResponse = await collection.insertMany( allRecords.dataByCountry )
					result.countries = dbResponse.result.ok === 1
				}
			}
			// Save latest data
			if ( allRecords.latest ) {
				allRecords.latest.lastUpdated = new Date().toISOString()
				const collection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_LATEST )
				const dbDelete = await collection.deleteMany( {} )

				if ( dbDelete ) {
					const dbResponse = await collection.insertOne( allRecords.latest )
					result.latest = dbResponse.result.ok === 1
				}
			}
			// Save confirmed data
			if ( allRecords.confirmed.locations ) {
				const collection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_CONFIRMED )
				const dbDelete = await collection.deleteMany( {} )

				if ( dbDelete ) {
					const dbResponse = await collection.insertMany( allRecords.confirmed.locations )
					result.confirmed = dbResponse.result.ok === 1
				}
			}
			// Save recovered data
			if ( allRecords.recovered.locations ) {
				const collection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_RECOVERED )
				const dbDelete = await collection.deleteMany( {} )

				if ( dbDelete ) {
					const dbResponse = await collection.insertMany( allRecords.recovered.locations )
					result.recovered = dbResponse.result.ok === 1
				}
			}
			// Save deaths data
			if ( allRecords.deaths.locations ) {
				const collection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_DEATHS )
				const dbDelete = await collection.deleteMany( {} )

				if ( dbDelete ) {
					const dbResponse = await collection.insertMany( allRecords.deaths.locations )
					result.deaths = dbResponse.result.ok === 1
				}
			}

			apiCache.clear()

			return res.status( 200 ).send( buildResponse( false, 200, '', result ) )
		} catch ( error ) {
			console.log( error )
			let message = 'Bad request'
			let status = 400

			if ( error === null ) {
				message = 'Could not get COVID-19 data from source'
				status = 500
			} else if ( error.name ) {
				message = genericErrorMessage
				status = 500
			}

			return res.status( status ).send( buildResponse( true, status, message ) )
		}
	}
}