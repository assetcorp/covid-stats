/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	Box, Typography, Container, Grid, Button, colors, ButtonBase, Card, CircularProgress, Grow
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { blue, red, green, orange } from '@material-ui/core/colors'
import {
	AddBoxOutlined, ArrowDownwardOutlined, CheckOutlined, ChevronLeftOutlined, ChevronRightOutlined, ClearOutlined,
	DeleteOutlineOutlined, EditOutlined, FilterListOutlined, FirstPageOutlined, LastPageOutlined, RemoveOutlined, SaveAltOutlined,
	SearchOutlined, ViewColumnOutlined, RefreshOutlined, PersonAddOutlined as ConfirmedIcon, VerifiedUserOutlined as RecoveredIcon,
	PersonAddDisabledOutlined as FatalityIcon, GroupOutlined as ActiveIcon
} from '@material-ui/icons'
import { commaFy, environmentSettings, hexToRGB } from '../src/utils'
import { getCovidLatestData, getCovidCountryData } from '../src/redux/actions/AppActions'
import MaterialTable from 'material-table'
import moment from 'moment'
import { logEvent, logException, logTiming } from '../src/utils/analytics'

const tableIcons = {
	Add: React.forwardRef( ( props, ref ) => <AddBoxOutlined {...props} ref={ref} /> ),
	Check: React.forwardRef( ( props, ref ) => <CheckOutlined {...props} ref={ref} /> ),
	Clear: React.forwardRef( ( props, ref ) => <ClearOutlined {...props} ref={ref} /> ),
	Delete: React.forwardRef( ( props, ref ) => <DeleteOutlineOutlined {...props} ref={ref} /> ),
	DetailPanel: React.forwardRef( ( props, ref ) => <ChevronRightOutlined {...props} ref={ref} /> ),
	Edit: React.forwardRef( ( props, ref ) => <EditOutlined {...props} ref={ref} /> ),
	Export: React.forwardRef( ( props, ref ) => <SaveAltOutlined {...props} ref={ref} /> ),
	Filter: React.forwardRef( ( props, ref ) => <FilterListOutlined {...props} ref={ref} /> ),
	FirstPage: React.forwardRef( ( props, ref ) => <FirstPageOutlined {...props} ref={ref} /> ),
	LastPage: React.forwardRef( ( props, ref ) => <LastPageOutlined {...props} ref={ref} /> ),
	NextPage: React.forwardRef( ( props, ref ) => <ChevronRightOutlined {...props} ref={ref} /> ),
	PreviousPage: React.forwardRef( ( props, ref ) => <ChevronLeftOutlined {...props} ref={ref} /> ),
	ResetSearch: React.forwardRef( ( props, ref ) => <ClearOutlined {...props} ref={ref} /> ),
	Search: React.forwardRef( ( props, ref ) => <SearchOutlined {...props} ref={ref} /> ),
	SortArrow: React.forwardRef( ( props, ref ) => <ArrowDownwardOutlined {...props} ref={ref} /> ),
	ThirdStateCheck: React.forwardRef( ( props, ref ) => <RemoveOutlined {...props} ref={ref} /> ),
	BoxColumn: React.forwardRef( ( props, ref ) => <ViewColumnOutlined {...props} ref={ref} /> ),
	Refresh: React.forwardRef( ( props, ref ) => <RefreshOutlined {...props} ref={ref} /> ),
}

const Home = () => {
	const classes = useStyles()
	const dispatch = useDispatch()

	// Redux state selectors
	const covidLatestData = useSelector( state => state.AppReducer.covidLatestData )
	const covidLatestDataLoading = useSelector( state => state.AppReducer.covidLatestDataLoading )
	const covidCountryData = useSelector( state => state.AppReducer.covidCountryData )
	const covidCountryDataLoading = useSelector( state => state.AppReducer.covidCountryDataLoading )

	// Redux action players
	const dispatchGetCovidLatest = async () => dispatch( getCovidLatestData() )
	const dispatchGetCovidCountry = async () => dispatch( getCovidCountryData() )

	// Component state
	const [countryData, setCountryData] = React.useState( null )
	const [startTime, setStartTime] = React.useState( moment() )

	const handleGetLocation = async () => {
		try {
			const startTime = moment()
			const request = await fetch( 'https://api.ipdata.co/?api-key=9b1d4f5beaa5fabf10e98f7d64e3cb2c07eda6aedc4b0481b493e4b4' )
			const endTime = moment()
			const fetchTime = moment.duration( moment( endTime ).diff( startTime ) ).asMilliseconds()

			logTiming( 'fetch-resources', 'get-location-data', fetchTime, 'Fetch location data' )

			if ( request.status !== 200 ) throw request

			const response = await request.json()
			if ( !response.country_code ) throw response

			const countryCode = response.country_code

			handleCountryData( countryCode )
		} catch ( error ) {
			logException( 'Failed to get location data', false )
			// Error
		}
	}

	const handleCountryData = async countryCode => {
		if ( countryCode ) {
			try {
				const startTime = moment()
				const request = await fetch( `${environmentSettings.API_URI}/countries/${countryCode}` )
				const endTime = moment()
				const fetchTime = moment.duration( moment( endTime ).diff( startTime ) ).asMilliseconds()

				logTiming( 'fetch-resources', 'get-single-country', fetchTime, 'Fetch single country' )

				if ( request.status !== 200 ) throw request

				const result = await request.json()

				if ( !result.response ) throw result

				setCountryData( result.response )

			} catch ( error ) {
				logException( 'Failed to get single country data', false )
				setCountryData( null )
				// console.log( error )
			}
		}
	}

	const getCountryCode = countryCode => {
		let code = countryCode
		if ( code === 'USA' ) code = 'US'
		else if ( code === 'UK' ) code = 'GB'

		return code
	}

	React.useEffect( () => {
		try {
			setStartTime( moment() )
			handleGetLocation()
			dispatchGetCovidLatest()
			dispatchGetCovidCountry()
			logEvent( 'USER-INTERACTION', 'Waited for resources to initialize', 'The user has waited for all resources to start initializing' )

			window.addEventListener( 'beforeunload', () => {
				const duration = moment.duration( moment().diff( startTime ) ).asSeconds()

				logEvent( 'USER-INTERACTION', `The user is leaving the page after ${duration} seconds`, `After ${duration} seconds, 
				the user is leaving ${window.location.href}`, duration, true )
			} )

		} catch ( error ) {
			logException( 'Something went wrong while initializing resources', false )
			// Do nothing
		}
	}, [] )

	let latestItems = [
		{
			name: 'Confirmed cases',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.confirmed ) || 'N/A',
			icon: ConfirmedIcon,
			iconColor: colors.blue[500],
			action: async () => {
			}
		}, {
			name: 'Recovered cases',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.recovered ) || 'N/A',
			icon: RecoveredIcon,
			iconColor: colors.green[500],
			action: async () => {
			}
		}, {
			name: 'Deaths',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.deaths ) || 'N/A',
			icon: FatalityIcon,
			iconColor: colors.red[500],
			action: async () => {
			}
		}, {
			name: 'Active',
			value: covidLatestDataLoading ? 'Loading...' : commaFy( covidLatestData.active ) || 'N/A',
			icon: ActiveIcon,
			iconColor: colors.orange[500],
			action: async () => {
			}
		}
	]

	// console.log( countryData )
	return (
		<Box className={classes.root}>

			<Box className={classes.sectionContainer} style={{ margin: '50px 0' }}>
				<Container className={classes.descriptor}>
					<Box className={classes.subDiscriptor}>
						<Typography variant='h1' color="textSecondary" align="center">{environmentSettings.app.appName}</Typography>
						{
							covidLatestData &&
							<Typography variant="body1" align="center" style={{ margin: '40px 0 50px' }}>
								Last updated: {moment( covidLatestData.lastUpdated ).format( 'dddd Do MMMM, YYYY LT' )}
							</Typography>
						}
					</Box>
					{
						countryData &&
						<Grow in timeout={700}>
							<ButtonBase className={classes.actionButtonCountry}>
								<Card className={classes.actionsCardCountry}>
									<Typography variant='h3' align="center" paragraph>{countryData.country}</Typography>
									<Box className={classes.actionIconCountry}>
										<img
											style={{ width: 100, height: 100 }}
											alt={countryData.country}
											src={`https://www.countryflags.io/${getCountryCode( countryData.countryCode )}/flat/64.png`}
										/>
									</Box>
									<Box className={classes.actionDetailsCountry}>
										{/* <Typography variant='body1'>Confirmed: {commaFy( countryData.confirmed )} {` | Today: ${commaFy( countryData.confirmedToday )}`}</Typography>
										<Typography variant='body1'>Recovered: {commaFy( countryData.recovered )} — {Number( countryData.recoveredPer )}%</Typography>
										<Typography variant='body1'>Deaths: {commaFy( countryData.deaths )} — {Number( countryData.mortalityPer )}% {` | Today: ${commaFy( countryData.deathsToday )}`}</Typography>
										<Typography variant='body1'>Active: {commaFy( countryData.active )}</Typography> */}
										<Box style={{ width: '100%', maxWidth: 600 }}>
											<Box className={classes.detailsInner}>
												<Typography variant='h6' style={{ color: blue[300] }}>Total confirmed: </Typography>
												<Typography variant='h6' style={{ color: blue[300] }}>{commaFy( countryData.confirmed )}</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='body1' style={{ color: blue[300] }}>Confirmed today: </Typography>
												<Typography variant='body1' style={{ color: blue[300] }}>{commaFy( countryData.confirmedToday )}</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='h6' style={{ color: green[300] }}>Total recovered: </Typography>
												<Typography variant='h6' style={{ color: green[300] }}>{commaFy( countryData.recovered )}</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='body1' style={{ color: green[300] }}>Recovered Rate: </Typography>
												<Typography variant='body1' style={{ color: green[300] }}>{Number( countryData.recoveredPer )}%</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='h6' style={{ color: red[300] }}>Total deaths: </Typography>
												<Typography variant='h6' style={{ color: red[300] }}>{commaFy( countryData.deaths )}</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='body1' style={{ color: red[300] }}>Death Rate: </Typography>
												<Typography variant='body1' style={{ color: red[300] }}>{Number( countryData.mortalityPer )}%</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='body1' style={{ color: red[300] }}>Deaths today: </Typography>
												<Typography variant='body1' style={{ color: red[300] }}>{Number( countryData.deathsToday )}</Typography>
											</Box>
											<Box className={classes.detailsInner}>
												<Typography variant='h6' style={{ color: orange[300] }}>Total Active: </Typography>
												<Typography variant='h6' style={{ color: orange[300] }}>{commaFy( countryData.active )}</Typography>
											</Box>
										</Box>
									</Box>
								</Card>
							</ButtonBase>
						</Grow>
					}
					<Grid container spacing={2}>
						{
							latestItems.map( Item => (
								<Grid key={Item.name} xs={12} sm={6} item>
									<ButtonBase
										onClick={() => {
											if ( Item.action && typeof Item.action === 'function' )
												Item.action()

											logEvent( 'USER-INTERACTION', `User clicked on ${Item.name} button`, `The user clicked on the ${Item.name} 
											button that has a current value of ${Item.value}. The interaction is recorded ${moment.duration( moment().diff( startTime ) ).asSeconds()} seconds 
											after the user visited this ${window.location.href}`, moment.duration( moment().diff( startTime ) ).asSeconds() )
										}}
										TouchRippleProps={{
											color: Item.iconColor,
										}}
										style={{
											width: '100%',
										}}>
										<Card className={classes.actionsCard} style={{ backgroundColor: hexToRGB( Item.iconColor, 0.24 ) }}>
											<Box className={classes.actionDetails}>
												<Typography variant='h5'>{Item.value}</Typography>
												<Typography variant='body1'>{Item.name}</Typography>
											</Box>
											<Box className={classes.actionIcon}>
												{
													covidLatestDataLoading ?
														<CircularProgress size='large' style={{ color: Item.iconColor, backgroundColor: Item.iconColor }} /> :
														<Item.icon size={50} style={{
															color: Item.iconColor,
															width: 50,
															height: 50,
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

			<Container className={classes.sectionContainer}>
				<Box className={classes.mainContainer}>
					<Container>
						<Box className={classes.subDiscriptor}>
							<Typography variant='h2' color='textSecondary' className={classes.title} align="left">Learn more</Typography>
						</Box>
						<Box className={classes.subDiscriptor} style={{ marginBottom: 50 }}>
							<Typography variant='h4' color='initial' className={classes.subTitle} align='left'>
								{environmentSettings.app.appDescription}
							</Typography>
						</Box>
						<Box className={classes.subDiscriptor} style={{ textAlign: 'left' }}>
							<a href="https://exp-shell-app-assets.s3.us-west-1.amazonaws.com/android/%40delali/covid-stats-952975a5c31249e8ad3a78705e3e9933-signed.apk" download>
								<Button variant='contained' color='primary'>Download Android App</Button>
							</a>
						</Box>
					</Container>
				</Box>
			</Container>

			<Container className={classes.sectionContainer}>
				<MaterialTable
					isLoading={covidCountryDataLoading}
					icons={tableIcons}
					title='All affected countries'
					columns={[
						{ title: 'Country', field: 'country' },
						{ title: 'Confirmed', field: 'confirmed' },
						{ title: 'New', field: 'confirmedToday' },
						{ title: 'Recovered', field: 'recovered' },
						{ title: 'Deaths', field: 'deaths' },
					]}
					data={covidCountryData}
					actions={[
						{
							icon: () => <RefreshOutlined />,
							tooltip: 'Refresh Data',
							isFreeAction: true,
							onClick: async () => {
								dispatchGetCovidCountry()
								dispatchGetCovidLatest()

								logEvent( 'USER-INTERACTION', 'User clicked on refresh button', `The user clicked on the refresh 
											button. The interaction is recorded ${moment.duration( moment().diff( startTime ) ).asSeconds()} seconds 
											after the user visited this ${window.location.href}`, moment.duration( moment().diff( startTime ) ).asSeconds() )
							},
						},
					]}
					options={{
						loadingType: 'overlay',
						pageSize: ( covidCountryData.length === 0 || covidCountryDataLoading ) ? 5 : 20,
						grouping: true,
					}}
					detailPanel={rowData => {
						const countryCode = getCountryCode( rowData.countryCode )

						return (
							<Box className={classes.detailsContainer} style={{ width: '100%' }}>
								<img
									style={{ width: 64, height: 64 }}
									src={`https://www.countryflags.io/${countryCode}/flat/64.png`}
									alt={rowData.country}
								/>
								<Typography variant='h4'>{rowData.country}</Typography>
								<Box style={{ width: '100%', maxWidth: 600 }}>
									<Box className={classes.detailsInner}>
										<Typography variant='h6' style={{ color: blue[300] }}>Total confirmed: </Typography>
										<Typography variant='h6' style={{ color: blue[300] }}>{commaFy( rowData.confirmed )}</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='body1' style={{ color: blue[300] }}>Confirmed today: </Typography>
										<Typography variant='body1' style={{ color: blue[300] }}>{commaFy( rowData.confirmedToday )}</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='h6' style={{ color: green[300] }}>Total recovered: </Typography>
										<Typography variant='h6' style={{ color: green[300] }}>{commaFy( rowData.recovered )}</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='body1' style={{ color: green[300] }}>Recovered Rate: </Typography>
										<Typography variant='body1' style={{ color: green[300] }}>{Number( rowData.recoveredPer )}%</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='h6' style={{ color: red[300] }}>Total deaths: </Typography>
										<Typography variant='h6' style={{ color: red[300] }}>{commaFy( rowData.deaths )}</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='body1' style={{ color: red[300] }}>Death Rate: </Typography>
										<Typography variant='body1' style={{ color: red[300] }}>{Number( rowData.mortalityPer )}%</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='body1' style={{ color: red[300] }}>Deaths today: </Typography>
										<Typography variant='body1' style={{ color: red[300] }}>{Number( rowData.deathsToday )}</Typography>
									</Box>
									<Box className={classes.detailsInner}>
										<Typography variant='h6' style={{ color: orange[300] }}>Total Active: </Typography>
										<Typography variant='h6' style={{ color: orange[300] }}>{commaFy( rowData.active )}</Typography>
									</Box>
								</Box>
							</Box>
						)
					}}
					onRowClick={( event, rowData, togglePanel ) => {
						togglePanel()
						logEvent( 'USER-INTERACTION', `User expanded the row for country '${rowData.country}'`, `The user expanded details for
							the country ${rowData.country}. The interaction is recorded ${moment.duration( moment().diff( startTime ) ).asSeconds()} seconds 
							after the user visited this ${window.location.href}`, moment.duration( moment().diff( startTime ) ).asSeconds() )
					}}
				/>
			</Container>

			<Container className={classes.sectionContainer}>
				<Box className={classes.mainContainer}>
					<Container>
						<Box className={classes.subDiscriptor}>
							<Typography variant='h2' color='textSecondary' className={classes.title} align="left">About</Typography>
						</Box>
						<Box className={classes.subDiscriptor} style={{ marginBottom: 50 }}>
							<Typography variant='body1' paragraph color='initial' align='left'>
								It has become very obvious that Coronavirus COVID-19 has plagued the earth with its existence. As the world is finding means to combat this virus,
								Delalify presents COVID-STATS as an application that offers data solutions intended to keep people posted and updated on the COVID-19 pandemic.
							</Typography>
							<Typography variant='body1' paragraph color='initial' align='left'>
								We try our best to provide accurate and non-misleading data. We are always working hard to update our database with current data as and when we receive it.
								Please note that, the intention of our mobile app is not to spread spam or malware, Our application is currently not accepted on the Google Play Store because Google trusts only leading organizations to provide accurate data.
								We are working hard to ensure that, you are served with digital services that would inform you about the status of the virus and its effects.
							</Typography>
						</Box>
					</Container>
				</Box>
			</Container>

			<Container className={classes.sectionContainer}>
				<Box className={classes.mainContainer}>
					<Container>
						<Box className={classes.subDiscriptor}>
							<Typography variant='h2' color='textSecondary' className={classes.title} align="left">Sources</Typography>
						</Box>
						<Box className={classes.subDiscriptor} style={{ marginBottom: 50 }}>
							<Typography variant='body1' paragraph color='initial' align='left'>
								The data recorded on this website is gathered from the following:
							</Typography>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports" target="_blank" rel="noopener noreferrer">
								World Health Organization (WHO)
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://ghanahealthservice.org/covid19/" target="_blank" rel="noopener noreferrer">
								Ghana Health Service
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="http://weekly.chinacdc.cn/news/TrackingtheEpidemic.htm" target="_blank" rel="noopener noreferrer">
								China CDC (CCDC)
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://www.cdc.gov/coronavirus/2019-ncov/index.html" target="_blank" rel="noopener noreferrer">
								US CDC:
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://www.canada.ca/en/public-health/services/diseases/coronavirus.html" target="_blank" rel="noopener noreferrer">
								Government of Canada
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://www.health.gov.au/news/coronavirus-update-at-a-glance" target="_blank" rel="noopener noreferrer">
								Australia Government Department of Health
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://www.moh.gov.sg/covid-19" target="_blank" rel="noopener noreferrer">
								European Centre for Disease Prevention and Control (ECDC)
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="http://www.salute.gov.it/nuovocoronavirus" target="_blank" rel="noopener noreferrer">
								Italy Ministry of Health
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://coronavirus.1point3acres.com/en" target="_blank" rel="noopener noreferrer">
								1Point3Arces
							</a>
							<a style={{ display: 'block', margin: '10px 0' }} href="https://www.worldometers.info/coronavirus/" target="_blank" rel="noopener noreferrer">
								WorldoMeters
							</a>


						</Box>
					</Container>
				</Box>
			</Container>
		</Box>
	)
}

Home.getInitialProps = async () => {
	return true
}

const useStyles = makeStyles( ( theme => ( {
	root: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#000',
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
		width: '100%',
		height: 'auto',
		minHeight: 100,
		[theme.breakpoints.down( 'sm' )]: {
			padding: 0,
		},
		backgroundColor: 'transparent',
	},
	mainContainer: {
		margin: '16px 0',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: theme.spacing( 0, 2 ),
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
		backgroundColor: 'rgba(255, 255, 255, 0.23)',
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
	detailsContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		minHeight: 100,
		padding: theme.spacing( 2 ),
		backgroundColor: 'transparent',
	},
	detailsInner: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		// paddingHorizontal: theme.spacing( 1 ),
	},
	actionButtonCountry: {
		minHeight: 110,
		display: 'flex',
		alignItems: 'center',
		margin: '16px auto 50px',
		width: '100%',
	},
	actionsCardCountry: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		padding: theme.spacing( 1 ),
	},
	actionDetailsCountry: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	actionIconCountry: {
		display: 'flex',
		flexDirection: 'column',
		width: 100,
		margin: theme.spacing( 0, 2 ),
		alignItems: 'center',
		justifyContent: 'center'
	},
} ) ) )

export default Home