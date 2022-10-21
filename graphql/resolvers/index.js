// RESOLVERS
const Article = require("../../models/Article")
const { ApolloError } = require("apollo-server")
const User = require("../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

module.exports = {
    Article: {
        async author(parent) {
            return await User.findById(parent.author)
        }
    },

    User: {
        async articles(parent, { ID }) {
            return await Article.find({ ID })
        }
    },

    Query: {
        // ARTICLE
        async getArticleById(_, { ID }) {
            return await Article.findById(ID)
        },
        async getArticlesByType(_, { article_type }) {
            return await Article.find({ article_type })
        },
        async getArticles(_, { amount }) {
            return Article.find().sort({ createdAt: -1 }).limit(amount)
        },

        // USER
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
        // ARTICLES

        // NEWS
        async createNewsArticle(
            _,
            {
                newsArticleInput: {
                    title,
                    body,
                    excerpt,
                    image,
                    imagecredit,
                    tags,
                    category,
                    article_type,
                    author,
                    published
                }
            }
        ) {
            const createdNewsArticle = new Article({
                title: title,
                body: body,
                excerpt: excerpt,
                image: image,
                imagecredit: imagecredit,
                tags: tags,
                category: category,
                article_type: article_type,
                author: author,
                published: published,
                createdAt: new Date().toISOString()
            })
            const res = await createdNewsArticle.save()

            return {
                id: res.id,
                ...res._doc
            }
        },

        // EDU
        async createEduArticle(
            _,
            {
                eduArticleInput: {
                    title,
                    body,
                    excerpt,
                    image,
                    age_group,
                    imagecredit,
                    tags,
                    category,
                    article_type,
                    author,
                    published
                }
            }
        ) {
            const createdEduArticle = new Article({
                title: title,
                body: body,
                excerpt: excerpt,
                image: image,
                imagecredit: imagecredit,
                tags: tags,
                age_group: age_group,
                category: category,
                article_type: article_type,
                author: author,
                published: published,
                createdAt: new Date().toISOString()
            })
            const res = await createdEduArticle.save()

            return {
                id: res.id,
                ...res._doc
            }
        },

        // TRAVEL
        async createTravelArticle(
            _,
            {
                travelArticleInput: {
                    title,
                    body,
                    excerpt,
                    image,
                    imagecredit,
                    tags,
                    category,
                    article_type,
                    author,
                    published
                }
            }
        ) {
            const createdTravelArticle = new Article({
                title: title,
                body: body,
                excerpt: excerpt,
                image: image,
                imagecredit: imagecredit,
                tags: tags,
                category: category,
                article_type: article_type,
                author: author,
                published: published,
                createdAt: new Date().toISOString()
            })
            const res = await createdTravelArticle.save()

            return {
                id: res.id,
                ...res._doc
            }
        },

        // EDIT ALL ARTICLES
        async editArticle(
            _,
            {
                ID,
                editArticleInput: {
                    title,
                    body,
                    excerpt,
                    age_group,
                    image,
                    imagecredit,
                    tags,
                    category,
                    published
                }
            }
        ) {
            const wasEdited = (
                await Article.updateOne(
                    { _id: ID },
                    {
                        title: title,
                        body: body,
                        excerpt: excerpt,
                        age_group: age_group,
                        image: image,
                        imagecredit: imagecredit,
                        tags: tags,
                        category: category,
                        published: published
                    }
                )
            ).modifiedCount
            return wasEdited
        },

        // DELETE
        async deleteArticle(_, { ID }) {
            const wasDeleted = (await Article.deleteOne({ _id: ID }))
                .deletedCount
            return wasDeleted
        },

        // USER
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
                {
                    user_id: newUser._id,
                    email: email,
                    displayname: displayname
                },
                // process.env.SECRET
                "UNSAFE_STRING",
                {
                    expiresIn: "24h"
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
                        displayname: user.displayname,
                        email: user.email,
                        role: user.role
                    },
                    process.env.SECRET,
                    {
                        expiresIn: "24h"
                    }
                )

                // Attach token to user model
                user.token = token

                return {
                    id: user.id,
                    displayname: user.displayname,
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
                    {
                        displayname: displayname,
                        email: email,
                        role: role
                    }
                )
            ).modifiedCount

            return wasEdited
        }
    }
}
