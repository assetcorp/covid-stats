import validate from 'validate.js'

const VALIDATOR_CONSTRAINTS = {
	phone: {
		presence: true,
		length: { minimum: 9, maximum: 10, },
		numericality: {
			onlyInteger: true,
		},
	},
	email: {
		presence: true,
		email: true,
	},
	password: {
		presence: true,
		length: {
			minimum: 6,
			message: 'Password must be at least 6 characters',
		},
	},
	confirmPassword: {
		equality: 'password',
	},
}

validate.validators.email.message = 'This does not look like a valid email'

export const validateLogin = form => {
	const loginConstraints = {
		phone: VALIDATOR_CONSTRAINTS.phone,
		password: VALIDATOR_CONSTRAINTS.password,
	}

	return validate( form, loginConstraints )
}

export const validateRegistration = form => {
	const registerConstraints = {
		phone: VALIDATOR_CONSTRAINTS.phone,
		email: VALIDATOR_CONSTRAINTS.email,
		password: VALIDATOR_CONSTRAINTS.password,
		confirmPassword: VALIDATOR_CONSTRAINTS.confirmPassword,
	}

	return validate( form, registerConstraints )
}

export const validateField = ( field, value ) => {
	return validate.single( value, VALIDATOR_CONSTRAINTS[field] )
}