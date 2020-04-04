import React from 'react'
import { CssBaseline, useMediaQuery, Box } from '@material-ui/core'
import { ThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { grey, deepOrange } from '@material-ui/core/colors'
import PropTypes from 'prop-types'

const globalFont = {
	fontFamily: 'Ubuntu',
	fontStyle: 'normal',
	fontDisplay: 'swap',
	fontWeight: 400,
}

const App = props => {
	// Configure Material-UI theme
	const prefersDarkMode = useMediaQuery( '(prefers-color-scheme: dark)' )
	const mainTheme = React.useMemo(
		() =>
			createMuiTheme( {
				palette: {
					type: 'dark',
					primary: {
						main: deepOrange[700],
						contrastText: '#fff',
					},
					secondary: {
						main: grey[700],
						contrastText: '#fff',
					},
					text: {
						default: '#fff',
						primary: grey[50],
						secondary: deepOrange[500],
					},
					background: {
						main: grey[700],
						light: grey[200],
						dark: grey[900],
						paper: 'rgba(0, 0, 0, 0.7)',
					},
				},
				typography: {
					fontFamily: 'Ubuntu',
				},
				shadows: Array( 25 ).fill( 'none' ),
				overrides: {
					MuiCssBaseline: {
						'@global': {
							'@font-face': [globalFont],
						},
					},
					MuiAppBar: {
						root: {
							boxShadow: 'none'
						}
					},
				}
			} ),
		[prefersDarkMode]
	)
	const theme = responsiveFontSizes( mainTheme )

	return (
		<React.Fragment>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Box display='flex' flexDirection='column' minHeight='100vh'>
					{props.children}
				</Box>
			</ThemeProvider>
		</React.Fragment>
	)
}

App.propTypes = {
	children: PropTypes.any
}

export default App