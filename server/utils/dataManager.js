import fetch from 'isomorphic-unfetch'
import { SERVER_VARIABLES, CacheGroups, CONFIG_VARIABLES } from '.'
import apiCache from 'apicache'
import _ from 'lodash'
import moment from 'moment'
import { getDatabase } from './db'
import COUNTRY_REGIONS from '../../src/data/country_region.json'

// Getting country data from https://coronavirus-19-api.herokuapp.com/countries
export const getCountryData = async () => {
	try {
		const request = await fetch( SERVER_VARIABLES.COVID_COUNTRY_URL )

		if ( request.status !== 200 ) throw request

		apiCache.clear( CacheGroups.COUNTRIES )
		return await request.json()
	} catch ( error ) {
		console.log( error )
		return null
	}
}

// Getting latest data from https://coronavirus-19-api.herokuapp.com/all
export const getLatestData = async () => {
	try {
		const request = await fetch( SERVER_VARIABLES.COVID_LATEST_URL )

		if ( request.status !== 200 ) throw request

		apiCache.clear( CacheGroups.LATEST )
		return await request.json()
	} catch ( error ) {
		console.log( error )
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
		console.log( error )
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
			if ( !confirmedMap[mapKey] || !recoveredMap[mapKey] || !deathsMap[mapKey] ) return
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
			if ( !confirmedMap[mapKey] || !recoveredMap[mapKey] || !deathsMap[mapKey] ) return
			countryMap[countryName].confirmed += confirmedMap[mapKey].latest
			countryMap[countryName].recovered += recoveredMap[mapKey].latest
			countryMap[countryName].deaths += deathsMap[mapKey].latest

			if ( mapKey.trim().toLowerCase() !== countryName.trim().toLowerCase() ) {
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

const validateFirstPointOfCountrySource = countryData => {
	const newData = []
	const countryDataArray = COUNTRY_REGIONS.filter( item => {
		if ( !item.countryName || item.countryName === '' ) return false
		return true
	} ).map( country => {
		return country.countryName.toLowerCase()
	} )

	// console.log( countryDataArray )

	try {
		if ( !Array.isArray( countryData ) ) return false

		for ( let item of countryData ) {
			if ( !( 'country' in item && 'cases' in item && 'todayCases' in item && 'deaths' in item &&
				'todayDeaths' in item && 'recovered' in item && 'active' in item && 'critical' in item &&
				'casesPerOneMillion' in item ) ) continue

			if ( countryDataArray.indexOf( item.country.toLowerCase() ) !== -1 )
				newData.push( item )
		}

		return newData
	} catch ( error ) {
		console.log( error )
		return false
	}
}
const validateFirstPointOfLatestSource = latestData => {

	try {
		if ( !latestData )
			return false

		if ( 'cases' in latestData && 'deaths' in latestData && 'recovered' in latestData ) return latestData
		else return false

	} catch ( error ) {
		console.log( error )
		return false
	}
}

const getCountryByCountryName = ( countryData, countryName = '' ) => {
	try {
		if ( !Array.isArray( countryData ) ) return false
		const name = countryName.trim().toLowerCase()
		for ( let item of countryData ) {
			if ( item.country.trim().toLowerCase() === name ) {
				return item
			}
		}
		return null
	} catch ( error ) {
		console.log( error )
		return false
	}
}

export const getUpdatedData = async () => {
	try {
		apiCache.clear()
		const countryData = await getCountryData()
		const trackerData = await getTrackerData()
		const latestData = await getLatestData()
		const validCountryData = validateFirstPointOfCountrySource( countryData )
		const validLatestData = validateFirstPointOfLatestSource( latestData )
		let globalCountryData = []
		let confirmed = []
		let deaths = []
		let latest = {}
		let recovered = []
		let dataByCountry = []


		if ( trackerData ) {
			confirmed = trackerData.confirmed
			deaths = trackerData.deaths
			latest = trackerData.latest
			recovered = trackerData.recovered
			dataByCountry = getDataByCountry( confirmed, deaths, recovered )
		}

		if ( validLatestData ) {
			const newLatest = {
				confirmed: validLatestData.cases,
				recovered: validLatestData.recovered,
				deaths: validLatestData.deaths,
				active: ( Number( validLatestData.cases ) - ( Number( validLatestData.recovered ) + Number( validLatestData.deaths ) ) ),
				lastUpdated: new Date().toISOString(),
			}
			// console.log( newLatest )
			latest = newLatest
		}

		if ( validCountryData ) {
			for ( let item of validCountryData ) {
				let newItem = {
					confirmed: item.cases,
					confirmedToday: item.todayCases,
					recovered: item.recovered,
					deaths: item.deaths,
					deathsToday: item.todayDeaths,
					country: item.country,
					countryCode: item.country,
					confirmedByDay: [],
					recoveredByDay: [],
					deathsByDay: [],
					lastUpdated: new Date().toISOString(),
					active: item.active,
					critical: item.critical,
					mortalityPer: ( ( Number( item.deaths ) / Number( item.cases ) ) * 100 ).toFixed( 2 ),
					recoveredPer: ( ( Number( item.recovered ) / Number( item.cases ) ) * 100 ).toFixed( 2 )
				}
				const data = getCountryByCountryName( dataByCountry, item.country )
				if ( data ) {
					let confirmed = [...data.confirmedByDay]
					let deaths = [...data.deathsByDay]

					confirmed[confirmed.length - 1] = Number( confirmed[confirmed.length - 2] ) + Number( newItem.confirmedToday )
					deaths[deaths.length - 1] = Number( deaths[deaths.length - 2] ) + Number( newItem.deathsToday )

					newItem.countryCode = data.countryCode
					newItem.confirmedByDay = confirmed
					newItem.recoveredByDay = data.recoveredByDay
					newItem.deathsByDay = deaths
					newItem.lastUpdated = data.lastUpdated
				}
				globalCountryData.push( newItem )
			}
		} else {
			for ( let item of dataByCountry ) {
				let newItem = {
					confirmed: item.confirmed,
					confirmedToday: item.confirmedByDay[item.confirmedByDay.length - 1],
					recovered: item.recovered,
					deaths: item.deaths,
					deathsToday: item.deathsByDay[item.deathsByDay.length - 1],
					country: item.country,
					countryCode: item.countryCode,
					confirmedByDay: item.confirmedByDay,
					recoveredByDay: item.recoveredByDay,
					deathsByDay: item.deathsByDay,
					lastUpdated: item.lastUpdated,
					active: item.active,
					critical: 'N/A',
					mortalityPer: item.mortalityPer,
					recoveredPer: item.recoveredPer
				}
				globalCountryData.push( newItem )
			}
		}

		return {
			confirmed, deaths, latest, recovered, dataByCountry: globalCountryData,
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
		console.log( error )
		return null
	}
}

export const getLatestDataFromDB = async () => {
	try {
		const db = await getDatabase( CONFIG_VARIABLES.DB_NAME )

		// Get latest
		const latestCollection = await db.collection( CONFIG_VARIABLES.DB_COLLECTION_LATEST )
		const latestResults = await latestCollection.find( {}, { projection: { _id: 0 } } ).toArray()
		if ( Array.isArray( latestResults ) )
			return latestResults[0]
		else throw latestResults

	} catch ( error ) {
		console.log( error )
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

		if ( Array.isArray( results ) ) return results

		return null
	} catch ( error ) {
		console.log( error )
		return null
	}
}