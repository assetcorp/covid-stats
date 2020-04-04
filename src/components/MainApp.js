import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { initGA, logPageView } from '../utils/analytics'
import { Box, Typography } from '@material-ui/core'
import { environmentSettings } from '../utils'

const MainApp = props => {
	const theme = useTheme()
	const router = useRouter()

	// Component state
	const [accountDrawer, setAccountDrawer] = React.useState( false )
	const [pageReady, setPageReady] = React.useState( false )

	const classes = useStyles( {
		accountDrawer,
	} )

	const drawerPaths = ['countries', 'about', 'terms', 'privacy']
	let accountPlace = false
	drawerPaths.forEach( item => {
		if ( router.pathname.substr( 1 ).includes( item ) )
			accountPlace = true
	} )
	React.useEffect( () => {
		setAccountDrawer( accountPlace )
	}, [router.pathname] )

	React.useEffect( () => {
		if ( !window.GA_INITIALIZED ) {
			initGA()
			window.GA_INITIALIZED = true
			setPageReady( true )
		}
		logPageView()
	}, [] )

	if ( !pageReady ) {
		return (
			<Box className={classes.loadingBox}>
				<Typography variant='h1' color="textSecondary" align="center" style={{ marginBottom: theme.spacing( 2 ) }}>
					{environmentSettings.app.appName}
				</Typography>
				<Typography variant="h6" align="center" paragraph style={{ fontStyle: 'italic' }}>
					Bringing you the best of COVID-19 statistics.
				</Typography>
				<Typography variant="body1" align="center">
					Please wait. Loading data sources...
				</Typography>
			</Box>
		)
	}

	return (
		<main className={classes.container}>
			{props.children}
		</main>
	)
}

const drawerWidth = 240

const useStyles = makeStyles( theme => ( {
	container: {
		display: 'flex',
		flexDirection: 'column',
		minHeight: `calc(100vh - ${( theme.mixins.toolbar.minHeight + theme.spacing( 1 ) )}px)`,
		[theme.breakpoints.up( 'sm' )]: {
			width: props => ( props.accountDrawer ) ? `calc(100% - ${drawerWidth}px)` : '100%',
			marginRight: props => ( props.accountDrawer ) ? drawerWidth : 0,
		},
		backgroundColor: '#000',
	},
	loadingBox: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: '100vh',
		backgroundColor: '#000',
		padding: theme.spacing( 2 ),
	},
} ) )

MainApp.propTypes = {
	children: PropTypes.any.isRequired,
}

export default MainApp