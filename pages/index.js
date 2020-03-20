/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Box, Typography, Container, Grid, Button, colors, ButtonBase, Card, CircularProgress
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
	SentimentDissatisfiedOutlined as DissatisfiedIcon, SentimentSatisfiedOutlined as SatisfiedIcon,
	SentimentVeryDissatisfiedOutlined as VeryDissatisfiedIcon
} from '@material-ui/icons'
import { IMAGES } from '../src/components/media'
// import fetch from 'isomorphic-unfetch'
import { commaFy, environmentSettings } from '../src/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { getCovidLatestData } from '../src/redux/actions/AppActions'

const Home = props => {
	const theme = useTheme()
	const classes = useStyles()
	const dispatch = useDispatch()

	// Redux state selectors
	const covidLatestData = useSelector( state => state.AppReducer.covidLatestData )
	const covidLatestDataLoading = useSelector( state => state.AppReducer.covidLatestDataLoading )


	// Redux action players
	const dispatchGetCovidLatest = async () => dispatch( getCovidLatestData() )

	// Component state

	// console.log( props )

	React.useEffect( () => {
		try {
			// if ( props.games && props.games.length > 0 ) {
			// 	setGames( props.games )
			// 	dispatchSetRandomGames( props.games )
			// }
			dispatchGetCovidLatest()
		} catch ( error ) {
			// Do nothing
		}
	}, [props] )

	const latestItems = [
		{
			name: 'Confirmed cases',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.confirmed ) || 'N/A',
			icon: DissatisfiedIcon,
			iconColor: colors.blue[500],
			action: async () => {
			}
		}, {
			name: 'Recovered cases',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.recovered ) || 'N/A',
			icon: SatisfiedIcon,
			iconColor: colors.green[500],
			action: async () => {
			}
		}, {
			name: 'Deaths',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.deaths ) || 'N/A',
			icon: VeryDissatisfiedIcon,
			iconColor: colors.red[500],
			action: async () => {
			}
		},
		{
			name: 'Active',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.deaths ) || 'N/A',
			icon: DissatisfiedIcon,
			iconColor: colors.orange[500],
			action: async () => {
			}
		},
	]


	return (
		<Box className={classes.root}>

			<Box className={classes.headerSectionBox}>
				<Box className={classes.headerSectionOverlay}>
					<Box className={classes.headerContent}>
						<Container className={classes.descriptor}>
							<Box className={classes.subDiscriptor}>
								<Typography variant='h1' component="h1" align="center" className={classes.title}>{environmentSettings.app.appName}</Typography>
							</Box>
							<Grid container spacing={2}>
								{
									latestItems.map( Item => (
										<Grid key={Item.name} xs={12} sm={6} className={classes.subDiscriptor} item>
											<ButtonBase
												onClick={() => {
													if ( Item.action && typeof Item.action === 'function' )
														Item.action()
												}}
												TouchRippleProps={{
													color: Item.itemColor,
												}}
												style={{
													width: '100%',
												}}>
												<Card className={classes.actionsCard}>
													<Box className={classes.actionDetails}>
														<Typography variant='h5'>{Item.value}</Typography>
														<Typography variant='body1'>{Item.name}</Typography>
													</Box>
													<Box className={classes.actionIcon}>
														{
															covidLatestDataLoading ?
																<CircularProgress size='large' color={Item.iconColor} /> :
																<Item.icon size={36} style={{
																	color: Item.iconColor,
																	width: 36,
																	height: 36,
																}} />
														}
													</Box>
												</Card>
											</ButtonBase>
										</Grid>
									) )
								}
								<Grid xs={12} sm={6} className={classes.subDiscriptor} item>

								</Grid>
							</Grid>
						</Container>
					</Box>
				</Box>
			</Box>

			<Container className={classes.sectionContainer}>
				<Box className={classes.mainContainer}>
					<Container>
						<Box className={classes.subDiscriptor}>
							<Typography variant='h2' color='secondary' className={classes.title} align="left">Learn more</Typography>
						</Box>
						<Box className={classes.subDiscriptor} style={{ marginBottom: 50 }}>
							<Typography variant='h4' color='initial' className={classes.subTitle} align='left'>
								{environmentSettings.app.appDescription}
							</Typography>
						</Box>
						<Box className={classes.subDiscriptor} style={{ textAlign: 'left' }}>
							<Link href='/countries'>
								<a>
									<Button variant='contained' color='primary'>See affected countries</Button>
								</a>
							</Link>
						</Box>
					</Container>
				</Box>
			</Container>
		</Box >
	)
}

// Home.getInitialProps = async ( { req } ) => {
// 	let props = { games: [] }

// 	if ( req ) {

// 		// Get a list of random games for game partials
// 		const request = await fetch( `http://${req.headers.host}/api/games?random=6` )
// 		const gameData = await request.json()

// 		if ( 'response' in gameData ) props.games = gameData.response
// 	}

// 	return props
// }

const useStyles = makeStyles( ( theme => ( {
	root: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#000',
	},
	headerSectionOverlay: {
		width: '100%',
		height: '100vh',
		backgroundColor: 'rgba(0, 0, 0, 0.53)',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerSectionBox: {
		flexGrow: 1,
		width: '100%',
		height: '100vh',
		backgroundImage: `url('${IMAGES.background}')`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
	},
	headerContent: {
		position: 'relative',
		width: '100%',
		height: 760,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		[theme.breakpoints.down( 'sm' )]: {
			height: 600,
		},
	},
	descriptor: {
		width: '100%',
		height: 'auto',
	},
	subDiscriptor: {
		width: '100%',
		margin: theme.spacing( 2, 0 ),
	},
	sectionContainer: {
		position: 'relative',
		top: 0,
		height: 'auto',
		minHeight: '20vh',
		marginTop: theme.spacing( 3 ),
		[theme.breakpoints.down( 'sm' )]: {
			padding: 0,
		},
		backgroundColor: 'transparent',
	},
	mainContainer: {
		margin: '100px 0 150px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing( 0, 3 ),
		[theme.breakpoints.down( 'sm' )]: {
			margin: '50px 0 70px'
		}
	},
	actionsCard: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		minHeight: 110,
		padding: theme.spacing( 2, 3 ),
		backgroundColor: 'rgba(0, 0, 0, 0.43)',
	},
	actionDetails: {
		display: 'flex',
		flexDirection: 'column',
		flex: 2,
		alignItems: 'flex-start',
		justifyContent: 'space-around'
	},
	actionIcon: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
} ) ) )

export default Home