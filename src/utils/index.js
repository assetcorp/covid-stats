
// eslint-disable-next-line no-undef
export const isProduction = ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ) ? false : true

export const isBrowser = typeof window !== 'undefined'

export const reduxActionDispatcher = ( type, payload ) => {
	return {
		type,
		payload,
	}
}

export const isMobileApp = () => {
	if ( !isBrowser ) return false

	return getQueryVariable( 'mobileApp' )
}

export const genRandomString = ( length = 10 ) => {
	let text = ''
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charLen = parseInt( length )

	for ( var i = 0; i < charLen; i++ )
		text += possible.charAt( Math.floor( Math.random() * possible.length ) )

	return text.toUpperCase()
}

export const commaFy = num => {
	let str = num.toString().split( '.' )
	if ( str[0].length >= 5 ) {
		str[0] = str[0].replace( /(\d)(?=(\d{3})+$)/g, '$1,' )
	}
	if ( str[1] && str[1].length >= 5 ) {
		str[1] = str[1].replace( /(\d{3})/g, '$1 ' )
	}
	return str.join( '.' )
}

export const environmentSettings = {
	// API_URI: isProduction ? 'https://covid.delalify.com/api' : 'http://localhost:3000/api',
	API_URI: 'https://covid.delalify.com/api',
	CLIENT_BASE_URL: isProduction ? 'https://covid.delalify.com/' : 'http://localhost:3000/',
	app: {
		appName: 'COVID STATS',
		appDescription: 'COVID STATS is an application that helps to inform and alert you on cases of Coronavirus (COVID-19) and their status.',
		appKeywords: 'covid-19,coronavirus,statistics,covid',
	},
}

export const genericErrorMessage = 'Something went wrong. We are working to fix it.'

export const setCookie = ( name, value, days ) => {
	if ( isBrowser ) {
		let expires = ''
		if ( days ) {
			let date = new Date()
			date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) )
			expires = '; expires=' + date.toUTCString()
		}
		document.cookie = name + '=' + ( value || '' ) + expires + '; path=/'
	}
}

export const getCookie = ( name ) => {
	if ( isBrowser ) {
		let nameEQ = name + '='
		let ca = document.cookie.split( ';' )
		for ( let i = 0; i < ca.length; i++ ) {
			let c = ca[i]
			while ( c.charAt( 0 ) === ' ' ) c = c.substring( 1, c.length )
			if ( c.indexOf( nameEQ ) === 0 ) return c.substring( nameEQ.length, c.length )
		}
		return null
	}
}

export const eraseCookie = ( name ) => {
	if ( isBrowser )
		document.cookie = name + '=; Max-Age=-99999999;'
}

export const appPages = [
	{
		name: 'Home',
		pathname: '/',
		title: 'Home',
		description: environmentSettings.app.appDescription,
		keywords: environmentSettings.app.appKeywords,
		imagePath: '/static/images/logo_512.png',
		header: true,
		footer: true,
	}, {
		name: 'Terms',
		pathname: '/terms',
		title: 'Terms of Service',
		description: 'By accessing this website we assume you accept these terms and conditions. Do not continue to use COVID STATS if you do not agree to take all of the terms and conditions stated on this page.',
		keywords: `terms of service, conditions, holspi games, rights, responsibilities, ${environmentSettings.app.appKeywords}`,
		imagePath: '/static/images/logo_512.png',
		header: true,
		footer: true,
	}, {
		name: 'Privacy',
		pathname: '/privacy',
		title: 'Privacy Policy',
		description: 'We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website,',
		keywords: `privacy policy, protecting rights, ${environmentSettings.app.appKeywords}`,
		imagePath: '/static/images/logo_512.png',
		header: true,
		footer: true,
	},
]

export const getPageFromAppPages = pathname => {
	let appPage = {
		name: 'Home',
		pathname: '/',
		title: 'Home',
		description: environmentSettings.app.appDescription,
		keywords: environmentSettings.app.appKeywords,
		imagePath: '/static/images/logo_512.png',
		header: true,
		footer: true,
	}
	appPages.forEach( page => {
		if ( pathname === page.pathname ) {
			appPage = page
			return
		}
	} )
	return appPage
}

export const getQueryVariable = ( variable ) => {
	if ( isBrowser ) {
		const query = window.location.search.substring( 1 )
		const vars = query.split( '&' )

		for ( let i = 0; i < vars.length; i++ ) {
			let pair = vars[i].split( '=' )
			if ( decodeURIComponent( pair[0] ) === variable )
				return decodeURIComponent( pair[1] )
		}
	}

	return false
}
