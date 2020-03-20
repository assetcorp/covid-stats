import React from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Container, Link } from '@material-ui/core'
import { environmentSettings, isMobileApp, getPageFromAppPages } from '../utils'
import { useSelector } from 'react-redux'
// import NextLink from 'next/link'


const Footer = () => {
	const router = useRouter()
	const appPage = getPageFromAppPages( router )

	const appSections = useSelector( state => state.AppReducer.appSections )

	const classes = useStyles( {
		accountDrawer: appSections.drawer,
		transparentHeder: appPage.header === 'transparent',
	} )

	// We do not want to display the header in a mobile app
	// Also show header only on pages that support it
	if ( isMobileApp() || !appSections.footer ) return null


	return (
		<div className={classes.root}>
			<Container component='footer' className={classes.footer}>
				<Typography variant='body2' color='textSecondary' align='center'>
					{'Copyright © '}
					<Link color='inherit' href={environmentSettings.CLIENT_BASE_URL}>
						{environmentSettings.app.appName}
					</Link>{' '}
					{new Date().getFullYear()}
					{'.'}
				</Typography>
			</Container>
		</div>
	)
}

const drawerWidth = 240

const useStyles = makeStyles( theme => ( {
	'@global': {
		ul: {
			margin: 0,
			padding: 0,
		},
		li: {
			listStyle: 'none',
		},
	},
	root: {
		width: '100%',
		marginTop: 'auto',
		[theme.breakpoints.up( 'sm' )]: {
			width: props => ( props.accountDrawer ) ? `calc(100% - ${drawerWidth}px)` : '100%',
			marginRight: props => ( props.accountDrawer ) ? drawerWidth : 0,
		},
		backgroundColor: 'rgba(0, 0, 0, 0.43)',
	},
	footer: {
		borderTop: `1px solid ${theme.palette.divider}`,
		// marginTop: theme.spacing( 8 ),
		paddingTop: theme.spacing( 3 ),
		paddingBottom: theme.spacing( 3 ),
		[theme.breakpoints.up( 'sm' )]: {
			paddingTop: theme.spacing( 6 ),
			paddingBottom: theme.spacing( 6 ),
		},
	},
	link: {
		margin: theme.spacing( 1, 1.5 ),
	},
} ) )

export default Footer