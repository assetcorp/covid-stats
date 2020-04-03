import React from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, LinearProgress } from '@material-ui/core'
import { environmentSettings, getPageFromAppPages } from '../utils'
import { Cookie } from './Cookie'
import { NextSeo } from 'next-seo'


const Header = () => {

	const router = useRouter()
	const theme = useTheme()
	const appPage = getPageFromAppPages( router.pathname )

	// Redux state selectors
	const appSections = useSelector( state => state.AppReducer.appSections )

	const classes = useStyles( {
		accountDrawer: appSections.drawer,
		transparentHeder: appPage.header === 'transparent',
	} )

	// Component state
	const [loading, setLoading] = React.useState( false )


	const renderHeader = () => {
		// We do not want to display the header in a mobile app
		// Also show header only on pages that support it
		// if ( isMobileApp() || !appSections.header ) return null

		return null

		// return (
		// 	<Box className={classes.root}>
		// 		{/* <HideOnScroll {...props}> */}
		// 		<AppBar className={classes.appBar}>
		// 			<Toolbar>
		// 				<Typography variant='h6' className={classes.title}>
		// 					{appPage.title || environmentSettings.app.appName}
		// 				</Typography>
		// 			</Toolbar>
		// 		</AppBar>
		// 		{/* </HideOnScroll> */}
		// 	</Box>
		// )
	}


	React.useEffect( () => {
		const handleRouteChange = ( err, url, loading ) => {
			if ( err.cancelled ) return setLoading( false )

			setLoading( loading )
		}

		router.events.on( 'routeChangeStart', ( err, url ) => handleRouteChange( err, url, true ) )
		router.events.on( 'routeChangeComplete', ( err, url ) => handleRouteChange( err, url, false ) )
		router.events.on( 'routeChangeError', ( err, url ) => handleRouteChange( err, url, false ) )

		return () => {
			router.events.off( 'routeChangeStart', ( err, url ) => handleRouteChange( err, url, false ) )
			router.events.off( 'routeChangeComplete', ( err, url ) => handleRouteChange( err, url, false ) )
			router.events.off( 'routeChangeError', ( err, url ) => handleRouteChange( err, url, false ) )
		}
	}, [] )

	return (
		<React.Fragment>
			<Cookie />
			<NextSeo
				title={appPage.title}
				titleTemplate={`%s | ${environmentSettings.app.appName}`}
				description={appPage.description}
				canonical={`${environmentSettings.CLIENT_BASE_URL.replace( /\/$/, '' )}${router.pathname}`}
				openGraph={{
					url: `${environmentSettings.CLIENT_BASE_URL.replace( /\/$/, '' )}${router.pathname}`,
					title: appPage.title,
					description: appPage.description,
					images: [
						{
							url: `${environmentSettings.CLIENT_BASE_URL.replace( /\/$/, '' )}${appPage.imagePath}`,
							width: 512,
							height: 512,
							alt: appPage.name,
						},
					],
					site_name: environmentSettings.app.appName,
				}}
				twitter={{
					handle: '@delalify',
					site: '@delalify',
					cardType: 'summary_large_image',
				}}
				additionalMetaTags={[{
					property: 'keywords',
					name: 'dc:keywords',
					content: appPage.keywords
				}, {
					property: 'theme-color',
					name: 'theme-color',
					content: theme.palette.primary.main,
				}]}
			/>
			{
				loading &&
				<Box className={classes.loadingBox}>
					<LinearProgress />
				</Box>
			}
			{renderHeader()}
		</React.Fragment>
	)
}


const useStyles = makeStyles( () => ( {
	root: {
		width: '100%',
	},
	loadingBox: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		zIndex: 2002,
	},
} ) )

export default Header