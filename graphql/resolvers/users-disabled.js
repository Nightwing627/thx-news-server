// RESOLVERS

const { ApolloError } = require("apollo-server")
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = {
    Query: {
        async getUserById(parent, { ID }) {
            return await User.findById(ID)
        },
        async getUser(_, { token }) {
            return await User.findOne({ token: token })
        },
        async getUsers(_, { amount }) {
            return User.find().sort({ createdAt: -1 }).limit(amount)
        }
    },
    Mutation: {
        async registerUser(
            _,
            { registerInput: { username, displayname, email, password } }
        ) {
            // See if user exists
            const oldUser = await User.findOne({ email })
            if (oldUser) {
                throw new ApolloError(
                    "User already exists",
                    "USER_ALREADY_EXISTS"
                )
            }

            // Encrypt password
            var encyrptedPassword = await bcrypt.hash(password, 10)

            // Mongoose model
            const newUser = new User({
                username: username,
                displayname: displayname,
                email: email.toLowerCase(),
                password: encyrptedPassword
            })

            // Create token
            const token = jwt.sign(
                { user_id: newUser._id, email },
                process.env.SECRET,
                {
                    expiresIn: "2h"
                }
            )

            newUser.token = token

            //Save user
            const res = await newUser.save()

            return {
                id: res.id,
                ...res._doc
            }
        },
        async loginUser(_, { loginInput: { username, password } }) {
            // Check user exists
            const user = await User.findOne({ username })

            // Check password
            if (User && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    {
                        user_id: user._id,
                        username,
                        email: user.email,
                        role: user.role
                    },
                    process.env.SECRET,
                    {
                        expiresIn: "2h"
                    }
                )

                // Attach token to user model
                user.token = token

                return {
                    id: user.id,
                    ...user._doc
                }
            } else {
                throw new ApolloError(
                    "Incorrect credentials",
                    "INCORRECT_LOGIN_CREDENTIALS"
                )
            }
        },

        async deleteUser(_, { ID }) {
            const wasDeleted = (await User.deleteOne({ _id: ID })).deletedCount
            return wasDeleted
        },
        async editUser(_, { ID, editUserInput: { displayname, email, role } }) {
            const wasEdited = (
                await User.updateOne(
                    { _id: ID },
                    { displayname: displayname, email: email, role: role }
                )
            ).modifiedCount

            return wasEdited
        }
    }
}
