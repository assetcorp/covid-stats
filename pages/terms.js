import React from 'react'
import {
	Box, Typography, Container, Button, ExpansionPanel, ExpansionPanelSummary,
	ExpansionPanelActions, ExpansionPanelDetails
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ExpandMoreOutlined as ExpandMoreIcon } from '@material-ui/icons'
import { AllTerms } from '../src/components/Terms'
import { isBrowser } from '../src/utils'
import Link from 'next/link'

const About = () => {
	const classes = useStyles()

	const [expanded, setExpanded] = React.useState( null )

	const handleExpand = ( index, code ) => ( event, expand ) => {
		try {
			setExpanded( expand ? index : false )
			if ( isBrowser ) {
				document.getElementById( code ).scrollIntoView( true )
				window.scrollBy( 0, -60 )
			}
		} catch ( error ) {
			// Error
		}

	}

	const allTerms = AllTerms( { classes } )

	return (
		<Box className={classes.root}>
			<Container className={classes.sectionContainer}>
				<Typography variant='h2' color='secondary' gutterBottom className={classes.title}>Terms and Conditions</Typography>
				<hr style={{ marginBottom: 50 }} />
				{allTerms.map( ( term, index ) => {
					return (
						<ExpansionPanel
							id={term.code}
							key={term + index}
							expanded={expanded === index}
							onChange={handleExpand( index, term.code )}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className={classes.heading}>{term.title}</Typography>
								<Typography className={classes.secondaryHeading}>{term.text}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								{term.content}
							</ExpansionPanelDetails>
							<ExpansionPanelActions>
								<Button variant='text' color='secondary' onClick={() => {
									handleExpand( index )
									setExpanded( false )
								}} >Close</Button>
							</ExpansionPanelActions>
						</ExpansionPanel>
					)
				} )}
				<Link href='/about'>
					<a>
						<Button variant='contained' size='medium' color='primary' style={{ marginTop: 50 }}>Learn more</Button>
					</a>
				</Link>
			</Container>
		</Box >
	)
}

const useStyles = makeStyles( ( theme => ( {
	root: {
		display: 'flex',
		flexGrow: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		backgroundColor: '#000',
		padding: theme.spacing( 2 ),
	},
	sectionContainer: {
		position: 'relative',
		top: 0,
		height: 'auto',
		minHeight: '20vh',
		marginTop: ( theme.mixins.toolbar.minHeight + theme.spacing( 1 ) + theme.spacing( 5 ) ),
		marginBottom: 50,
		[theme.breakpoints.down( 'sm' )]: {
			padding: 0,
		},
		backgroundColor: 'transparent',
	},
	subColor: {
		color: theme.palette.text.primary,
	},
	sectionBox: {
		margin: theme.spacing( 9, 0 ),
		padding: theme.spacing( 3, 0 ),
		width: '100%'
	},
	title: {
		fontSize: '2rem',
		marginBottom: '0.525rem',
		[theme.breakpoints.up( 'md' )]: {
			fontSize: '3.75rem',
			marginBottom: '1.2rem',
		},
	},
	flexCenter: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	para: {
		margin: '20px auto'
	},
	heading: {
		fontSize: theme.typography.pxToRem( 15 ),
		flexBasis: '33.33%',
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem( 15 ),
		color: theme.palette.text.secondary,
	},
} ) ) )

export default About