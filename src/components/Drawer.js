import React from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
	Hidden, Drawer, List,
	ListItem, ListItemIcon, ListItemText, Divider,
} from '@material-ui/core'
import {
	HomeOutlined as HomeIcon, InfoOutlined as AboutIcon, FlagOutlined as FlagIcon,
} from '@material-ui/icons'
import { toggleAppDrawer } from '../redux/actions/AppActions'
import { isMobileApp } from '../utils'

const AppDrawer = () => {

	if ( isMobileApp() ) return null

	const classes = useStyles()
	const theme = useTheme()
	const dispatch = useDispatch()
	const router = useRouter()

	// Redux state selectors
	const appDrawerOpen = useSelector( state => state.AppReducer.appDrawerOpen )

	// Redux action players
	const dispatchToggleDrawer = state => dispatch( toggleAppDrawer( state ) )

	// Component state
	const [accountDrawer, setAccountDrawer] = React.useState( false )

	const handleDrawerToggle = () => {
		dispatchToggleDrawer( !appDrawerOpen )
	}

	const defaultItems = [
		{
			name: 'Home',
			link: '',
			icon: <HomeIcon />,
		}, {
			name: 'Countries',
			link: 'countries',
			icon: <FlagIcon />,
		}, {
			name: 'About',
			link: 'about',
			icon: <AboutIcon />,
		},
	]
	const additionalItems = [
		{
			name: 'Terms',
			link: 'terms',
			icon: <AboutIcon />,
		}, {
			name: 'Privacy',
			link: 'privacy',
			icon: <AboutIcon />,
		},
	]


	const drawerPaths = ['countries', 'about', 'terms', 'privacy']
	let accountPlace = false
	drawerPaths.forEach( item => {
		if ( router.pathname.substr( 1 ).includes( item ) )
			accountPlace = true
	} )

	React.useEffect( () => {
		setAccountDrawer( accountPlace )
	}, [router.pathname] )


	const drawerContent = (
		<div>
			<div className={classes.toolbar} />
			<List>
				{
					defaultItems.map( ( item ) => (
						<ListItem button key={item.name}
							onClick={() => {
								dispatchToggleDrawer()
								router.push( `/${item.link}` )
							}}>
							<ListItemIcon>
								{item.icon}
							</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItem>
					) )
				}
			</List>
			<Divider />
			<List>
				{
					additionalItems.map( ( item ) => (
						<ListItem button key={item.name}
							onClick={() => {
								dispatchToggleDrawer()
								router.push( `/${item.link}` )
							}}>
							<ListItemIcon>
								{item.icon}
							</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItem>
					) )
				}
			</List>
		</div >
	)

	return (
		<nav className={classes.drawer} aria-label='Navigation items'>
			<Hidden smUp implementation='css'>
				<Drawer
					variant='temporary'
					anchor='right'
					open={appDrawerOpen}
					onClose={handleDrawerToggle}
					classes={{
						paper: classes.drawerPaper,
					}}
					ModalProps={{
						keepMounted: true, // Better performance on mobile
					}}>
					{drawerContent}
				</Drawer>
			</Hidden>
			{
				accountDrawer &&
				<Hidden xsDown implementation='css'>
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant='permanent'
						anchor='right'
						open>
						{drawerContent}
					</Drawer>
				</Hidden>
			}
		</nav>
	)
}

const drawerWidth = 240

const useStyles = makeStyles( theme => ( {
	drawer: {
		background: 'transparent',
		[theme.breakpoints.up( 'sm' )]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	drawerPaper: {
		width: drawerWidth,
		background: 'rgba(0, 0, 0, 0.43)',
	},
	toolbar: theme.mixins.toolbar,
} ) )

export default AppDrawer