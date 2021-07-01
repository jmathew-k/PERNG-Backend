const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server')

const { User } = require('../models')

// A map of functions which return data for the schema
module.exports = {
	Query: {
		getUsers: async () => {
			try {
				const users = await User.findAll()

				return users
			} catch (err) {
				console.log(err)
			}
		},
	},
	Mutation: {
		register: async (_, args) => {
			let { username, email, password, confirmPassword } = args
			let errors = {}

			try {
				// TODO: Validate input data
				if(email.trim() === '') errors.email = 'Email must not be empty'
				if(username.trim() === '') errors.username = 'Username must not be empty'
				if(password.trim() === '') errors.password = 'Password must not be empty'
				if(confirmPassword.trim() === '') errors.confirmPassword = 'Repeat Password must not be empty'

				// TODO: Check if username / email exits
				const userByUsername = await User.findOne({ where: { username }})
				const userByEmail = await User.findOne({ where: { email }})

				if(userByUsername) errors

				//Hash password
				password = await bcrypt.hash(password, 6)

				//Create user
				const user = await User.create({
					username, email, password
				})
				return user

			} catch(err) {
				console.log(err)
				throw err
			}
		}
	}
}
