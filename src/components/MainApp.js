import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { initGA, logPageView } from '../utils/analytics'

const MainApp = props => {

	const router = useRouter()

	// Component state
	const [accountDrawer, setAccountDrawer] = React.useState( false )

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
		}
		logPageView()
	}, [] )

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
} ) )

MainApp.propTypes = {
	children: PropTypes.any.isRequired,
}

export default MainApp