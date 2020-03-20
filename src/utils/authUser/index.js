import fetch from 'isomorphic-unfetch'
import { authService } from '../../utils'

export class Auth {
	constructor() {
		this.urlPath = '/api'
		this.user = null
	}

	async getUserDetails( userID = '', token = '', dataToken = '' ) {
		try {
			const request = await fetch( this.urlPath + `/user/details?userID=${userID}&dataToken=${dataToken}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			} )
			const data = await request.json()

			if ( data.status !== 200 && !data.response ) throw data

			authService.setUser( data.response )

			return data.response
		} catch ( error ) {
			return error
		}
	}

	async signInUser( phone, password, remember = false ) {
		try {
			// Request to log in
			const request = await fetch( this.urlPath + '/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( {
					phone,
					password,
					remember,
				} ),
			} )
			const data = await request.json()

			if ( data.status !== 200 || !data.response || !data.response.user ) throw data

			return data
		} catch ( error ) {
			return error
		}
	}

	async signOutUser() { }

	async refreshAuthToken( token, dataToken ) {
		try {
			// Request to log in
			const request = await fetch( this.urlPath + '/auth/refresh', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify( {
					dataToken,
				} )
			} )
			const data = await request.json()

			if ( data.status !== 200 || !data.response ) throw data

			return data
		} catch ( error ) {
			return error
		}
	}

	async createUserWithEmailAndPassword( phone, email, password ) {
		try {
			// Request to log in
			const request = await fetch( this.urlPath + '/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( {
					phone,
					email,
					password,
				} ),
			} )
			const data = await request.json()

			if ( data.status !== 200 || !data.response || !data.response.user ) throw data

			return data
		} catch ( error ) {
			return error
		}
	}

	async createUserWithGoogle() { }

	async createUserWithFacebook() { }
}