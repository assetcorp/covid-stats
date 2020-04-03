import React from 'react'
import App from 'next/app'
import '../src/app.css'
// Components
import WebApp from '../src/components/App'
import GlobalActions from '../src/components/GlobalActions'
import MainApp from '../src/components/MainApp'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
// Redux
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Store, StorePersister } from '../src/redux/Store'

class MyApp extends App {
	// Only uncomment this method if you have blocking data requirements for
	// every single page in your application. This disables the ability to
	// perform automatic static optimization, causing every page in your app to
	// be server-side rendered.
	//
	// static async getInitialProps( appContext ) {
	// 	// calls page's `getInitialProps` and fills `appProps.pageProps`
	// 	const appProps = await App.getInitialProps( appContext )

	// 	return { ...appProps }
	// }

	render() {
		const { Component, pageProps } = this.props
		return (
			<StoreProvider store={Store}>
				<PersistGate loading={null} persistor={StorePersister}>
					<WebApp>
						<GlobalActions />
						<Header />
						<MainApp>
							<Component {...pageProps} />
						</MainApp>
						<Footer />
					</WebApp>
				</PersistGate>
			</StoreProvider>
		)

	}
}

export default MyApp