import React from 'react'
import { Typography, Container, Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Link from 'next/link'

const Privacy = () => {
	const classes = useStyles()

	return (
		<Box className={classes.root}>
			<Container className={classes.sectionContainer}>
				<Typography variant='h2' color='secondary' gutterBottom className={classes.title}>Privacy Policy</Typography>
				<hr style={{ marginBottom: 50 }} />
				<Box>
					<Typography variant='h5' className={classes.para}>Introduction</Typography>
					<Typography variant='body1' className={classes.para}>
						{'It is Delalifys policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to https://covid.delalify.com/ (hereinafter, "us", "we", or "https://covid.delalify.com/"). We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy ("Privacy Policy") to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.'}
					</Typography>
					<Typography variant='body1' className={classes.para}>
						This Privacy Policy, together with the Terms and conditions posted on our Website, set forth the general rules and policies governing your use of our Website. Depending on your activities when visiting our Website, you may be required to agree to additional terms and conditions.
					</Typography>
					<Typography variant='h5' className={classes.para}>
						Website Visitors
					</Typography>
					<Typography variant='body1' className={classes.para}>
						{'Like most website operators, Delalifys collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Delalifys purpose in collecting non-personally identifying information is to better understand how Delalifys visitors use its website. From time to time, Delalifys may release non-personally-identifying information in the aggregate, e.g., by publishing a report on trends in the usage of its website.'}
					</Typography>
					<Typography variant='body1' className={classes.para}>
						Delalifys also collects potentially personally-identifying information like Internet Protocol (IP) addresses for logged in users and for users leaving comments on https://covid.delalify.com/ blog posts. Delalifys only discloses logged in user and commenter IP addresses under the same circumstances that it uses and discloses personally-identifying information as described below.
					</Typography>
					<Typography variant='h5' className={classes.para}>
						Gathering of Personally-Identifying Information
					</Typography>
					<Typography variant='body1' className={classes.para}>
						{'Certain visitors to Delalifys websites choose to interact with Delalifys in ways that require Delalifys to gather personally-identifying information. The amount and type of information that Delalifys gathers depend on the nature of the interaction. For example, we ask visitors who fill in the contact form at https://covid.delalify.com/ to provide a name, phone number and email address'}
					</Typography>
					<Typography variant='h5' className={classes.para}>
						Security
					</Typography>
					<Typography variant='body1' className={classes.para}>
						The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
					</Typography>
					<Typography variant='h5' className={classes.para}>
						Links To External Sites
					</Typography>
					<Typography variant='body1' className={classes.para}>
						{'Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party\'s site. We strongly advise you to review the Privacy Policy and the terms and conditions of every site you visit.'}
					</Typography>
					<Typography variant='body1' className={classes.para}>
						We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.
					</Typography>
					<Typography variant='h5' className={classes.para}>
						Aggregated Statistics
					</Typography>
					<Typography variant='body1' className={classes.para}>
						{'Delalifys may collect statistics about the behaviour of visitors to its website. Delalifys may display this information publicly or provide it to others. However, Delalifys does not disclose your personally-identifying information.'}
					</Typography>
					<Typography variant='h5' className={classes.para}>
						Privacy Policy Changes
					</Typography>
					<Typography variant='body1' className={classes.para}>
						{'Although most changes are likely to be minor, Delalifys may change its Privacy Policy from time to time, and in Delalifys sole discretion. Delalifys encourages visitors to frequently check this page for any changes to its Privacy Policy. Your continued use of this site after any change in this Privacy Policy will constitute your acceptance of such change.'}
					</Typography>
				</Box>
				<Link href='/about'>
					<a>
						<Button variant='contained' size='medium' color='primary' style={{ marginTop: 50 }}>Learn more</Button>
					</a>
				</Link>
			</Container>
		</Box>
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

export default Privacy