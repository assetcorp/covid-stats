import * as ACTIONS from './ACTION_CREATORS'
import { reduxActionDispatcher, genericErrorMessage, environmentSettings } from '../../utils'
import moment from 'moment'
import { logTiming, logException } from '../../utils/analytics'

export const cleanAppStorage = () => {
	return dispatch => {
		dispatch( reduxActionDispatcher( ACTIONS.CLEAN_APP ) )
	}
}

export const mergeAppStorage = () => {
	return dispatch => {
		dispatch( reduxActionDispatcher( ACTIONS.MERGE_APP_STORAGE ) )
	}
}

export const setAppSections = sections => dispatch => {
	dispatch( reduxActionDispatcher( ACTIONS.SET_APP_SECTIONS, sections ) )
}

export const toggleAppDrawer = status => dispatch => {
	dispatch( reduxActionDispatcher( ACTIONS.TOGGLE_APP_DRAWER, status ) )
}

export const getCovidLatestData = () => async dispatch => {
	dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_LATEST_DATA_LOADING, true ) )
	try {
		const startTime = moment()
		const request = await fetch( `${environmentSettings.API_URI}/latest` )
		const endTime = moment()
		const fetchTime = moment.duration( moment( endTime ).diff( startTime ) ).asMilliseconds()

		logTiming( 'fetch-resources', 'get-latest-data', fetchTime, 'Fetch latest data' )

		if ( request.status !== 200 ) throw request

		const result = await request.json()

		if ( !result.response ) throw result

		// console.log( result )

		dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_LATEST_DATA, result.response ) )
	} catch ( error ) {
		dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_LATEST_DATA_ERROR, genericErrorMessage ) )
		logException( 'Failed to get latest data', false )
	}
}
export const getCovidCountryData = () => async dispatch => {
	dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_COUNTRY_DATA_LOADING, true ) )
	try {
		const startTime = moment()
		const request = await fetch( `${environmentSettings.API_URI}/countries` )
		const endTime = moment()
		const fetchTime = moment.duration( moment( endTime ).diff( startTime ) ).asMilliseconds()

		logTiming( 'fetch-resources', 'get-all-countries', fetchTime, 'Fetch all countries' )

		if ( request.status !== 200 ) throw request

		const result = await request.json()

		if ( !result.response ) throw result

		dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_COUNTRY_DATA, result.response ) )
	} catch ( error ) {
		console.log( error )
		dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_COUNTRY_DATA_ERROR, genericErrorMessage ) )
		logException( 'Failed to get all countries data', false )
	}
}
export const getCovidGeneralData = () => async dispatch => {
	dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_GENERAL_DATA_LOADING, true ) )
	try {
		const request = await fetch( `${environmentSettings.API_URI}/general` )
		if ( request.status !== 200 ) throw request

		const result = await request.json()
		console.log( result.status )

		if ( !result.response ) throw result

		dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_GENERAL_DATA, result.response ) )
	} catch ( error ) {
		console.log( error )
		dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_GENERAL_DATA_ERROR, genericErrorMessage ) )
	}
}

export const setCovidCountryFilter = filter => dispatch =>
	dispatch( reduxActionDispatcher( ACTIONS.SET_COVID_COUNTRY_FILTER, filter ) )
