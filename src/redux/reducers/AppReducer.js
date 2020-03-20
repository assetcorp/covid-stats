/* eslint-disable indent */
import * as ACTIONS from '../actions/ACTION_CREATORS'

const initialState = {
	appLoading: false,
	appDrawerOpen: false,
	appUtilsLoading: false,
	appUtilsError: null,
	appUtils: {},
	appSections: {
		header: true,
		drawer: true,
		footer: true,
	},
	covidLatestData: {
		confirmed: 'N/A',
		recovered: 'N/A',
		deaths: 'N/A',
		active: 'N/A',
	},
	covidLatestDataLoading: false,
	covidLatestDataError: null,
	covidCountryData: [],
	covidCountryDataLoading: false,
	covidCountryDataLoadingError: null,
	covidCountryFilter: '',
	covidGeneralData: null,
	covidGeneralDataLoading: false,
	covidGeneralDataLoadingError: null,
}

export default ( state = initialState, action = null ) => {
	switch ( action.type ) {
		case ACTIONS.MERGE_APP_STORAGE:
			return state
		case ACTIONS.SET_APP_LOADING:
			return { ...state, appLoading: true }
		case ACTIONS.CLEAR_APP_LOADING:
			return { ...state, appLoading: false }
		case ACTIONS.CLEAN_APP:
			return { ...state, appLoading: false }
		case ACTIONS.TOGGLE_APP_DRAWER:
			return { ...state, appDrawerOpen: action.payload }
		case ACTIONS.SET_APP_SECTIONS:
			return { ...state, appSections: { ...state.appSections, ...action.payload } }
		case ACTIONS.SET_COVID_LATEST_DATA_LOADING:
			return { ...state, covidLatestDataLoading: action.payload || false }
		case ACTIONS.SET_COVID_LATEST_DATA_ERROR:
			return { ...state, covidLatestDataLoading: false, covidLatestDataError: action.payload || null }
		case ACTIONS.SET_COVID_LATEST_DATA:
			return { ...state, covidLatestDataLoading: false, covidLatestDataError: null, covidLatestData: action.payload || state.covidLatestData }
		case ACTIONS.SET_COVID_COUNTRY_DATA_LOADING:
			return { ...state, covidCountryDataLoading: action.payload || false }
		case ACTIONS.SET_COVID_COUNTRY_DATA_ERROR:
			return { ...state, covidCountryDataLoading: false, covidCountryDataError: action.payload || null }
		case ACTIONS.SET_COVID_COUNTRY_DATA:
			return { ...state, covidCountryDataLoading: false, covidCountryDataError: null, covidCountryData: action.payload || [] }
		case ACTIONS.SET_COVID_COUNTRY_FILTER:
			return { ...state, covidCountryFilter: action.payload || '' }
		case ACTIONS.SET_COVID_GENERAL_DATA_LOADING:
			return { ...state, covidGeneralDataLoading: action.payload || false }
		case ACTIONS.SET_COVID_GENERAL_DATA_ERROR:
			return { ...state, covidGeneralDataLoading: false, covidGeneralDataError: action.payload || null }
		case ACTIONS.SET_COVID_GENERAL_DATA:
			return { ...state, covidGeneralDataLoading: false, covidGeneralDataError: null, covidGeneralData: action.payload || null }
		default:
			return state
	}
}