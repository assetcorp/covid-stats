import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import localforage from 'localforage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const isBrowser = typeof window !== 'undefined'

// Middleware: Redux Persist Config
const persistConfig = {
	// Root
	key: 'root',
	// Storage Method (Web)
	storage: localforage,
	// Whitelist (Save Specific Reducers)
	whitelist: [
		'AppReducer',
	],
	// Blacklist (Don't Save Specific Reducers)
	blacklist: [],
	stateReconciler: autoMergeLevel2,
}

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer( persistConfig, reducers )

// Redux Store
const ReduxStore = isBrowser ?
	createStore( persistedReducer, composeWithDevTools( applyMiddleware( ReduxThunk ) ) ) :
	createStore( reducers, composeWithDevTools( applyMiddleware( ReduxThunk ) ) )

// Middleware: Redux Persist Persister
let persister = persistStore( ReduxStore )

export const Store = ReduxStore

export const StorePersister = persister