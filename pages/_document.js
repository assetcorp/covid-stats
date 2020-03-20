/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */
// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { environmentSettings, getPageFromAppPages } from '../src/utils'
import { NextSeo } from 'next-seo'
import { colors } from '@material-ui/core'

let pathname = '/'
let props = {}
class MyDocument extends Document {
	static async getInitialProps( ctx ) {
		const initialProps = await Document.getInitialProps( ctx )
		pathname = ctx.asPath
		// console.log( pathname, realPath, ctx.req )

		return { ...initialProps, ...props }
	}

	render() {
		let appPage = getPageFromAppPages( pathname )

		// console.log( appPage )
		return (
			<Html>
				<Head>
					<link rel='shortcut icon' href='/static/favicon.png' />
					<NextSeo
						title={appPage.title}
						titleTemplate={`%s | ${environmentSettings.app.appName}`}
						description={appPage.description}
						canonical={`${environmentSettings.CLIENT_BASE_URL.replace( /\/$/, '' )}${pathname}`}
						openGraph={{
							url: `${environmentSettings.CLIENT_BASE_URL.replace( /\/$/, '' )}${pathname}`,
							title: appPage.title,
							description: appPage.description,
							images: [
								{
									url: `${appPage.imagePath.startsWith( 'http' ) ? '' : environmentSettings.CLIENT_BASE_URL.replace( /\/$/, '' )}${appPage.imagePath}`,
									width: 512,
									height: 512,
									alt: appPage.name,
								},
							],
							defaultImageHeight: 512,
							defaultImageWidth: 512,
							site_name: environmentSettings.app.appName,
						}}
						twitter={{
							handle: '@delalify',
							site: '@delalify',
							cardType: 'summary_large_image',
						}}
						additionalMetaTags={[{
							property: 'keywords',
							name: 'dc:keywords',
							content: appPage.keywords
						}, {
							property: 'theme-color',
							name: 'theme-color',
							content: colors.deepOrange[500],
						}]}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument