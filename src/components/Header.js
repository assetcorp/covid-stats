import React from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
	AppBar, Toolbar, IconButton, Typography, Box, useMediaQuery, LinearProgress,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { toggleAppDrawer, setAppSections } from '../redux/actions/AppActions'
import { environmentSettings, isMobileApp, getPageFromAppPages } from '../utils'
import { Cookie } from './Cookie'
import { NextSeo } from 'next-seo'


const Header = () => {

	const router = useRouter()
	const dispatch = useDispatch()
	const theme = useTheme()
	const smallScreenUp = useMediaQuery( theme.breakpoints.up( 'sm' ) )
	const appPage = getPageFromAppPages( router.pathname )

	// Redux state selectors
	const appDrawerOpen = useSelector( state => state.AppReducer.appDrawerOpen )
	const appSections = useSelector( state => state.AppReducer.appSections )

	const classes = useStyles( {
		accountDrawer: appSections.drawer,
		transparentHeder: appPage.header === 'transparent',
	} )

	// Redux action players
	const dispatchToggleAppDrawer = () => dispatch( toggleAppDrawer( !appDrawerOpen ) )
	const handleToggleDrawer = () => dispatchToggleAppDrawer()
	const dispatchAppSections = sections => dispatch( setAppSections( sections ) )

	// Component state
	const [loading, setLoading] = React.useState( false )

	const accountDrawer = appSections.drawer

	const renderHeader = () => {
		// We do not want to display the header in a mobile app
		// Also show header only on pages that support it
		if ( isMobileApp() || !appSections.header ) return null

		return (
			<Box className={classes.root}>
				{/* <HideOnScroll {...props}> */}
				<AppBar className={classes.appBar}>
					<Toolbar>
						<Typography variant='h6' className={classes.title}>
							{appPage.title || environmentSettings.app.appName}
						</Typography>
						{
							!( accountDrawer && smallScreenUp ) &&
							<IconButton className={classes.menuButton} edge='start' color='inherit' aria-label='menu' onClick={handleToggleDrawer}>
								<MenuIcon />
							</IconButton>
						}
					</Toolbar>
				</AppBar>
				{/* </HideOnScroll> */}
			</Box>
		)
	}

	const drawerPaths = ['countries', 'about', 'terms', 'privacy']
	let accountPlace = false
	drawerPaths.forEach( item => {
		if ( router.pathname.substr( 1 ).includes( item ) )
			accountPlace = true
	} )
	React.useEffect( () => {
		dispatchAppSections( {
			drawer: accountPlace,
		} )

		dispatchAppSections( {
			header: !!appPage.header,
			footer: !!appPage.footer,
		} )

	}, [router.pathname] )

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

const drawerWidth = 240

const useStyles = makeStyles( theme => ( {
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
	appBar: {
		[theme.breakpoints.up( 'sm' )]: {
			width: props => ( props.accountDrawer ) ? `calc(100% - ${drawerWidth}px)` : '100%',
			marginRight: props => ( props.accountDrawer ) ? drawerWidth : 0,
		},
		backgroundColor: props => props.transparentHeder ? 'transparent' : 'rgba(0, 0, 0, 0.43)',
	},
	menuButton: {
		marginRight: theme.spacing( 2 ),
		[props => theme.breakpoints.up( 'sm' ) && !( props.accountDrawer )]: {
			display: 'none',
		},
	},
	title: {
		flexGrow: 1,
	},
} ) )

export default Header