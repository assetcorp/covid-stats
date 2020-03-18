import fetch from 'isomorphic-unfetch'
import { SERVER_VARIABLES, CacheGroups, CONFIG_VARIABLES } from '.'
import apiCache from 'apicache'
import _ from 'lodash'
import moment from 'moment'
import { getDatabase } from './db'

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

// Borrowed from https://github.com/sagarkarira/coronavirus-tracker-cli/blob/c8dedf18fd713dbf80a0ac1acaa4696c8112e55c/lib/corona.js#L26
export const getDataByCountry = ( confirmed, deaths, recovered ) => {
	const countryMap = {}
	const lastUpdated = confirmed.last_updated
	const confirmedMap = _.keyBy( confirmed.locations, ( i ) => i.country + i.province )
	const recoveredMap = _.keyBy( recovered.locations, ( i ) => i.country + i.province )
	const deathsMap = _.keyBy( deaths.locations, ( i ) => i.country + i.province )
	confirmed.locations.forEach( obj => {
		const countryName = obj.country
		const provinceName = obj.province
		const mapKey = countryName + provinceName
		if ( !countryMap[countryName] ) {
			countryMap[countryName] = {
				country: countryName,
				countryCode: obj.country_code,
				confirmed: confirmedMap[mapKey].latest,
				recovered: recoveredMap[mapKey].latest,
				deaths: deathsMap[mapKey].latest,
				confirmedByDay: historyObjToArr( confirmedMap[mapKey].history ),
				recoveredByDay: historyObjToArr( recoveredMap[mapKey].history ),
				deathsByDay: historyObjToArr( recoveredMap[mapKey].history ),
				lastUpdated,
			}
		} else {
			countryMap[countryName].confirmed += confirmedMap[mapKey].latest
			countryMap[countryName].recovered += recoveredMap[mapKey].latest
			countryMap[countryName].deaths += deathsMap[mapKey].latest
			countryMap[countryName].confirmedByDay = addArr(
				countryMap[countryName].confirmedByDay,
				historyObjToArr( confirmedMap[mapKey].history )
			)
			countryMap[countryName].recoveredByDay = addArr(
				countryMap[countryName].recoveredByDay,
				historyObjToArr( recoveredMap[mapKey].history )
			)
			countryMap[countryName].deathsByDay = addArr(
				countryMap[countryName].deathsByDay,
				historyObjToArr( deathsMap[mapKey].history )
			)
		}
	} )
	const countryArr = extraStats(
		Object.keys( countryMap ).map( key => countryMap[key] )
	)
	return _.sortBy( countryArr, ( o ) => -o.confirmed )
}

const extraStats = ( dataArr ) => {
	return dataArr.map( obj => Object.assign( {}, obj,
		{
			active: calActive( obj ),
			mortalityPer: calMortalityPer( obj ),
			recoveredPer: calRecoveredPer( obj ),
		} )
	)
}
const addArr = ( arr1, arr2 ) => {
	if ( arr1.length === 0 ) {
		return arr2
	}
	if ( arr2.length === 0 ) {
		return arr1
	}
	return arr1.map( ( val, index ) => arr1[index] + arr2[index] )
}
const historyObjToArr = ( historyObj ) => {
	const sortedTimestampArr = _.sortBy(
		Object.keys( historyObj ).map( date => new Date( date ).getTime() ),
		Number
	)
	return sortedTimestampArr.map( timestamp => {
		const dateFormatted = moment( timestamp ).format( 'M/D/YY' )
		return historyObj[dateFormatted]
	} )
}
const calActive = ( { confirmed, recovered, deaths } ) => confirmed - ( recovered + deaths )
const calMortalityPer = ( { confirmed, deaths } ) => ( ( deaths / confirmed ) * 100 ).toFixed( 2 )
const calRecoveredPer = ( { confirmed, recovered } ) => ( ( recovered / confirmed ) * 100 ).toFixed( 2 )

export const getUpdatedData = async () => {
	try {
		apiCache.clear()
		// const countryData = await getCountryData()
		const trackerData = await getTrackerData()

		if ( trackerData ) {
			const confirmed = trackerData.confirmed
			const deaths = trackerData.deaths
			const latest = trackerData.latest
			const recovered = trackerData.recovered

			// console.log( confirmed )

			const dataByCountry = getDataByCountry( confirmed, deaths, recovered )

			return {
				confirmed, deaths, latest, recovered, dataByCountry
			}
		}
	} catch ( error ) {
		console.log( error )
		return null
	}
}

export const getAllDataFromDB = async () => {
	try {
		const db = await getDatabase( CONFIG_VARIABLES.DB_NAME )
		let result = {
			latest: null,
			confirmed: null,
			recovered: null,
			deaths: null,
		}

		// Get latest
		const latestCollection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_LATEST )
		const latestResults = await latestCollection.find( {}, { projection: { _id: 0 } } ).toArray()
		if ( Array.isArray( latestResults ) )
			result.latest = latestResults[0]

		const confirmedCollection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_CONFIRMED )
		const confirmedResults = await confirmedCollection.find( {}, { projection: { _id: 0 } } ).toArray()
		if ( Array.isArray( confirmedResults ) )
			result.confirmed = confirmedResults

		const recoveredCollection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_RECOVERED )
		const recoveredResults = await recoveredCollection.find( {}, { projection: { _id: 0 } } ).toArray()
		if ( Array.isArray( recoveredResults ) )
			result.recovered = recoveredResults

		const deathsCollection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_DEATHS )
		const deathsResults = await deathsCollection.find( {}, { projection: { _id: 0 } } ).toArray()
		if ( Array.isArray( deathsResults ) )
			result.deaths = deathsResults

		return result
	} catch ( error ) {
		return null
	}
}

export const getCountryDataFromDB = async ( country_code = null ) => {
	try {
		const db = await getDatabase( CONFIG_VARIABLES.DB_NAME )

		const collection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_COUNTRIES )

		const filters = {}

		if ( country_code ) filters.countryCode = country_code

		const results = await collection.find( filters, { projection: { _id: 0 } } ).toArray()
		if ( Array.isArray( results ) )
			return results

		return null
	} catch ( error ) {
		return null
	}
}