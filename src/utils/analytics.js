import ReactGA from 'react-ga'

export const initGA = () => {
	ReactGA.initialize( 'UA-60020269-2' )
}
export const logPageView = () => {
	ReactGA.set( { page: window.location.pathname } )
	ReactGA.pageview( window.location.pathname )
}
export const logEvent = ( category = '', action = '', label = '', value = 0, nonInteraction = false, transport = 'beacon' ) => {
	if ( category && action ) {
		ReactGA.event( { category, action, label, value, nonInteraction, transport } )
	}
}
export const logException = ( description = '', fatal = false ) => {
	if ( description ) {
		ReactGA.exception( { description, fatal } )
	}
}

export const logTiming = ( category = '', variable = '', value = 0, label = '' ) => {
	if ( category ) {
		ReactGA.timing( {
			category,
			variable,
			value,
			label,
		} )
	}
}