import React from 'react'
import { isMobileApp, setCookie, getCookie } from '../utils'
import { DialogTitle, DialogContentText, DialogActions, Button, DialogContent, Dialog, useTheme } from '@material-ui/core'
import Link from 'next/link'

export const Cookie = () => {
	// console.log( 'MobileApp', isMobileApp() )
	if ( isMobileApp() ) return null

	const theme = useTheme()
	const [open, setOpen] = React.useState( getCookie( 'cookiePolicyNotice' ) !== 'true' )

	const handleClose = () => {
		setCookie( 'cookiePolicyNotice', true, 360 )
		setOpen( false )
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'>
			<DialogTitle id='alert-dialog-title'>Cookie policy agreement</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					This website uses cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
				</DialogContentText>
				<Link href='/privacy'>
					<a alt='Holspi Privacy Policy' style={{ display: 'inline' }}>
						<Button variant='text' size='small' style={{ color: theme.palette.secondary.light }}>Learn more</Button>
					</a>
				</Link>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color='primary' autoFocus>
					Agree
				</Button>
			</DialogActions>
		</Dialog>
	)
}