import React from 'react'
import { Box, Typography, Container, Button, useMediaQuery, } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { IMAGES } from '../src/components/media'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Lottie from 'react-lottie'
import lottie404Error from '../src/data/lotties/error_404.json'
import lottie500Error from '../src/data/lotties/error_500.json'
import lottieSorryError from '../src/data/lotties/error_sorry.json'
import Head from 'next/head'
import { environmentSettings } from '../src/utils'
// import { useRouter } from 'next/router'

const Error = props => {
	const classes = useStyles()
	const theme = useTheme()
	const statusCode = props.statusCode
	// const router = useRouter()
	const xSmallScreen = useMediaQuery( theme.breakpoints.down( 'xs' ) )

	let lottieData = lottieSorryError

	if ( statusCode === 404 ) lottieData = lottie404Error
	else if ( statusCode === 500 ) lottieData = lottie500Error

	return (
		<React.Fragment>
			<Head>
				<title>{`Error | ${environmentSettings.app.appName}`}</title>
				<meta key='og:title' name='og:title' property='og:title' content={`Error | ${environmentSettings.app.appName}`} />
			</Head>
			<Box className={classes.root}>
				<Container className={classes.sectionContainer}>
					<Box className={classes.mainContainer}>
						<Container>
							<Box className={classes.subDiscriptor}>
								<Typography variant='h2' color='secondary' className={classes.title} align='center'>Oops! Something did not go well</Typography>
							</Box>
							<Box className={classes.contentBox}>
								<Lottie
									options={{
										loop: true,
										autoplay: true,
										animationData: lottieData,
										rendererSettings: {
											preserveAspectRatio: 'xMidYMid slice'
										}
									}}
									width={xSmallScreen ? '100%' : 300}
									height={300}
									style={{
										backgroundColor: '#000',
									}}
								/>
							</Box>
							<Box className={classes.subDiscriptor} style={{ marginBottom: 50 }}>
								<Typography variant='h4' color='initial' className={classes.subTitle} align='center'>
									{
										( statusCode && statusCode !== 404 ) ?
											`A ${statusCode} error occurred on our server. We are working to fix this problem.` :
											'Looks like the requested resource could not be found.'
									}
								</Typography>
							</Box>
							<Box className={classes.subDiscriptor} style={{ textAlign: 'center' }}>
								<Link href='/'>
									<a>
										<Button variant='contained' color='primary'>Return to homepage</Button>
									</a>
								</Link>
							</Box>
						</Container>
					</Box>
				</Container>
			</Box>
		</React.Fragment>
	)
}

Error.propTypes = {
	statusCode: PropTypes.any,
}

Error.getInitialProps = async ( { res, err } ) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404
	return { statusCode }
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
	contentBox: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		height: 300,
		margin: theme.spacing( 5, 0 ),
	}
} ) ) )

export default Error